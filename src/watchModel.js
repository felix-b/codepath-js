import { createRegularNode, createRootNode } from "./codePathModel";
import { createMulticastDelegate } from "./multicastDelegate";

export function createWatchModel() {
  const insertNodesCallbacks = createMulticastDelegate(
    "WatchModel.insertNodes"
  );
  const removeNodesCallbacks = createMulticastDelegate(
    "WatchModel.removeNodes"
  );
  const updateNodesCallbacks = createMulticastDelegate(
    "WatchModel.updateNodes"
  );

  let rootNode = createRootNode();
  let topLevelNodes = [];
  let nextNodeId = 1;
  let currentContext = {};

  const model = {
    getRootNode() {
      return rootNode;
    },
    getTopLevelNodes() {
      return topLevelNodes;
    },
    subscribe(subscriber) {
      if (subscriber.insertNodes) {
        insertNodesCallbacks.add(subscriber.insertNodes);
      }
      if (subscriber.removeNodes) {
        removeNodesCallbacks.add(subscriber.removeNodes);
      }
      if (subscriber.updateNodes) {
        updateNodesCallbacks.add(subscriber.updateNodes);
      }
    },
    unsubscribe(subscriber) {
      if (subscriber.insertNodes) {
        insertNodesCallbacks.remove(subscriber.insertNodes);
      }
      if (subscriber.removeNodes) {
        removeNodesCallbacks.remove(subscriber.removeNodes);
      }
      if (subscriber.updateNodes) {
        updateNodesCallbacks.remove(subscriber.updateNodes);
      }
    },
    takeNodeId() {
      return nextNodeId++;
    },
    setContext(newContext) {
      currentContext = newContext || {};
      const queues = {
        insert: [],
        update: [],
        remove: []
      };
      topLevelNodes.forEach((node, index) => {
        const newValue = evaluateExpression(currentContext, node.entry.key);
        topLevelNodes[index] = updateWatchTreeNode(
          model,
          node,
          newValue,
          queues
        );
      });
      invokeQueueCallbacks(queues.remove, removeNodesCallbacks);
      invokeQueueCallbacks(queues.update, updateNodesCallbacks);
      invokeQueueCallbacks(queues.insert, insertNodesCallbacks);
    },
    addWatch(expression) {
      const value = evaluateExpression(currentContext, expression);
      const node = createWatchTreeNode(
        model,
        rootNode,
        expression,
        expression,
        value
      );
      const lastNode = topLevelNodes[topLevelNodes.length - 1];
      node.prevSibling = lastNode;
      if (lastNode) {
        lastNode.nextSibling = node;
      }
      topLevelNodes.push(node);
      insertNodesCallbacks.invoke([node]);
      return node;
    },
    removeWatchNode(topLevelNodeId) {
      const index = topLevelNodes.findIndex(node => node.id === topLevelNodeId);
      if (index >= 0) {
        const node = topLevelNodes[index];
        const prevSibling = topLevelNodes[index - 1];
        const nextSibling = topLevelNodes[index + 1];
        topLevelNodes.splice(index, 1);
        if (prevSibling) {
          prevSibling.nextSibling = nextSibling;
        }
        if (nextSibling) {
          nextSibling.prevSibling = prevSibling;
        }
        removeNodesCallbacks.invoke([node]);
      }
      return index;
    }
  };

  return model;
}

export function createWatchTreeNode(model, parent, label, key, value) {
  const entry = { label, value };
  const node = createRegularNode(model.takeNodeId(), parent, entry);
  const nodeOverride = createNodeOverride(node, model, value);

  Object.assign(node, {
    ...nodeOverride,
    entry: {
      ...node.entry,
      ...(nodeOverride.entry || {}),
      key
    }
  });

  return node;
}

function getValueType(value) {
  if (typeof value === "object" && !!value) {
    return Array.isArray(value) ? "array" : "object";
  }
  return "scalar";
}

function createNodeOverride(node, model, value) {
  const type = getValueType(value);
  switch (type) {
    case "scalar":
      return createScalarNodeOverride(node, model, value);
    case "array":
      return createArrayNodeOverride(node, model, value);
    case "object":
      return createObjectNodeOverride(node, model, value);
    default:
      throw new Error("value type not recognized: " + type);
  }
}

function createScalarNodeOverride(node, model, value) {
  return {
    entry: {
      type: "scalar"
    }
  };
}

function createObjectNodeOverride(node, model, value) {
  let override = {
    entry: {
      type: "object",
      getSubKeys(obj) {
        return Object.keys(obj || {}).sort();
      },
      getSubLabel(key) {
        return `${key}`;
      }
    }
  };
  const keys = Object.keys(value);
  if (keys.length > 0) {
    override.firstChild = createFirstChildProxyNode(
      node,
      model.takeNodeId(),
      () => {
        return createRealChildNodes(node, model, value, () => keys.sort());
      }
    );
  }
  return override;
}

function createArrayNodeOverride(node, model, value) {
  let override = {
    entry: {
      type: "array",
      getSubKeys(arr) {
        return Object.keys(arr);
      },
      getSubLabel(key) {
        return `[${key}]`;
      }
    }
  };
  if (value.length > 0) {
    override.firstChild = createFirstChildProxyNode(
      node,
      model.takeNodeId(),
      () => {
        return createRealChildNodes(
          node,
          model,
          value,
          () => Object.keys(value),
          key => `[${key}]`
        );
      }
    );
  }
  return override;
}

function createRealChildNodes(parent, model, value, getKeys, getLabel) {
  const nodes = [];
  const keys = getKeys();
  keys.forEach(key => {
    const lastSibling = nodes.length > 0 ? nodes[nodes.length - 1] : undefined;
    const label = getLabel ? getLabel(key) : key;
    const newSibling = createWatchTreeNode(
      model,
      parent,
      label,
      key,
      value[key]
    );
    newSibling.prevSibling = lastSibling;
    if (lastSibling) {
      lastSibling.nextSibling = newSibling;
    }
    nodes.push(newSibling);
  });
  return nodes;
}

function createFirstChildProxyNode(parent, firstChildId, createRealChildNodes) {
  let proxyNode = undefined;
  const replaceWithRealNode = () => {
    const propNodes = createRealChildNodes();
    parent.firstChild = propNodes[0];
    parent.lastChild = propNodes[propNodes.length - 1];
    return parent.firstChild;
  };
  proxyNode = createProxyNode(firstChildId, parent, replaceWithRealNode);
  return proxyNode;
}

function createProxyNode(id, parent, createRealNode) {
  let realNode = undefined;
  const getRealNode = () => {
    if (!realNode) {
      realNode = createRealNode();
    }
    return realNode;
  };
  const node = {
    id,
    parent,
    depth: parent.depth + 1,
    top: parent.top,
    get entry() {
      return getRealNode().entry;
    },
    get firstChild() {
      return getRealNode().firstChild;
    },
    get lastChild() {
      return getRealNode().lastChild;
    },
    get prevSibling() {
      return getRealNode().prevSibling;
    },
    get nextSibling() {
      return getRealNode().nextSibling;
    },
    metrics: undefined,
    isProxy: true
  };
  if (!node.top) {
    node.top = node;
  }
  return node;
}

function evaluateExpression(context, expression) {
  try {
    const func = Function(
      "context",
      `"use strict";return context.${expression}`
    );
    const value = func(context);
    return value;
  } catch (err) {
    return err.message;
  }
}

function updateWatchTreeNode(model, node, value, queues) {
  const type = getValueType(value);

  if (type !== node.entry.type) {
    const newNode = createWatchTreeNode(
      model,
      node.parent,
      node.entry.label,
      node.entry.key,
      value
    );
    const beforeSibling = node.nextSibling;
    removeNode(node, queues);
    insertNode(newNode, beforeSibling, queues);
    return newNode;
  }

  node.entry.value = value;
  queues.update.push(node);

  if (node.firstChild && !node.firstChild.isProxy) {
    const oldNodes = getSubNodesArray(node);
    const newKeys = node.entry.getSubKeys(value);

    for (
      let iOld = 0, iNew = 0;
      iOld < oldNodes.length || iNew < newKeys.length;

    ) {
      if (iOld < oldNodes.length && iNew < newKeys.length) {
        const oldKey = oldNodes[iOld].entry.key;
        const newKey = newKeys[iNew];
        if (oldKey < newKey) {
          removeNode(oldNodes[iOld], queues);
          iOld++;
        } else if (oldKey > newKey) {
          const newValue = value[newKey];
          const newNode = createWatchTreeNode(
            model,
            node,
            node.entry.getSubLabel(newKey),
            newKey,
            newValue
          );
          insertNode(newNode, oldNodes[iOld], queues);
          iNew++;
        } else {
          const newValue = value[newKey];
          updateWatchTreeNode(model, oldNodes[iOld], newValue, queues);
          iNew++;
          iOld++;
        }
      } else if (iOld < oldNodes.length) {
        removeNode(oldNodes[iOld], queues);
        iOld++;
      } else if (iNew < newKeys.length) {
        const newKey = newKeys[iNew];
        const newValue = value[newKey];
        const newNode = createWatchTreeNode(
          model,
          node,
          node.entry.getSubLabel(newKey),
          newKey,
          newValue
        );
        insertNode(newNode, undefined, queues);
        iNew++;
      }
    }

    // for (let child = node.firstChild ; !!child ; child = child.nextSibling) {
    //   const childValue = value[child.entry.key];
    //   if (typeof childValue !== 'undefined') {
    //     updateWatchTreeNode(model, child, childValue, queues);
    //   } else {
    //     queues.remove.push(removeNode(child, queues));
    //   }
    // }
  }

  return node;
}

function removeNode(node, queues, isThrowaway) {
  queues.remove.push(node);

  if (!isThrowaway) {
    if (node === node.parent.firstChild) {
      node.parent.firstChild = node.nextSibling;
    }
    if (node === node.parent.lastChild) {
      node.parent.lastChild = node.prevSibling;
    }
    if (node.prevSibling) {
      node.prevSibling.nextSibling = node.nextSibling;
    }
    if (node.nextSibling) {
      node.nextSibling.prevSibling = node.prevSibling;
    }
  }

  if (node.firstChild && !node.firstChild.isProxy) {
    for (let child = node.firstChild; !!child; child = child.nextSibling) {
      removeNode(node, queues, true);
    }
  }
}

function insertNode(node, beforeSibling, queues) {
  if (beforeSibling) {
    node.nextSibling = beforeSibling;
    node.prevSibling = beforeSibling.prevSibling;
  } else {
    node.prevSibling = node.parent.lastChild;
  }

  if (node.prevSibling) {
    node.prevSibling.nextSibling = node;
  } else {
    node.parent.firstChild = node;
  }

  if (node.nextSibling) {
    node.nextSibling.prevSibling = node;
  } else {
    node.parent.lastChild = node;
  }

  queues.insert.push(node);
}

function getSubNodesArray(node) {
  const subNodes = [];
  for (let child = node.firstChild; !!child; child = child.nextSibling) {
    subNodes.push(child);
  }
  return subNodes;
}

function invokeQueueCallbacks(queue, delegate) {
  if (queue.length > 0) {
    delegate.invoke(queue);
  }
}
