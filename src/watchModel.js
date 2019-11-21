import { createRegularNode, createRootNode } from "./codePathModel";
import { createMulticastDelegate } from "./multicastDelegate";

export function createWatchModel() {
  const insertNodesCallbacks = createMulticastDelegate(
    "WatchModel.insertNodes"
  );
  const removeNodesCallbacks = createMulticastDelegate(
    "WatchModel.removeNodes"
  );

  let rootNode = createRootNode();
  let topLevelNodes = [];
  let nextNodeId = 1;

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
    },
    unsubscribe(subscriber) {
      if (subscriber.insertNodes) {
        insertNodesCallbacks.remove(subscriber.insertNodes);
      }
      if (subscriber.removeNodes) {
        removeNodesCallbacks.remove(subscriber.removeNodes);
      }
    },
    takeNodeId() {
      return nextNodeId++;
    },
    addWatch(context, expression) {
      const value = evaluateExpression(context, expression);
      const node = createWatchTreeNode(model, rootNode, expression, value);
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

export function createWatchTreeNode(model, parent, label, value) {
  const entry = { label, value };
  const node = createRegularNode(model.takeNodeId(), parent, entry);
  const nodeOverride = createNodeOverride(node, model, value);

  Object.assign(node, {
    ...nodeOverride,
    entry: {
      ...node.entry,
      ...(nodeOverride.entry || {})
    }
  });

  return node;
}

function createNodeOverride(node, model, value) {
  if (typeof value === "object" && !!value) {
    return Array.isArray(value)
      ? createArrayNodeOverride(node, model, value)
      : createObjectNodeOverride(node, model, value);
  }
  return createScalarNodeOverride(node, model, value);
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
      type: "object"
    }
  };
  if (Object.keys(value).length > 0) {
    override.firstChild = createFirstChildProxyNode(
      node,
      model.takeNodeId(),
      () => {
        return createRealChildNodes(node, model, value);
      }
    );
  }
  return override;
}

function createArrayNodeOverride(node, model, value) {
  let override = {
    entry: {
      type: "array"
    }
  };
  if (value.length > 0) {
    override.firstChild = createFirstChildProxyNode(
      node,
      model.takeNodeId(),
      () => {
        return createRealChildNodes(node, model, value, key => `[${key}]`);
      }
    );
  }
  return override;
}

function createRealChildNodes(parent, model, value, getLabel) {
  const nodes = [];
  for (let key in value) {
    const lastSibling = nodes.length > 0 ? nodes[nodes.length - 1] : undefined;
    const label = getLabel ? getLabel(key) : key;
    const newSibling = createWatchTreeNode(model, parent, label, value[key]);
    newSibling.prevSibling = lastSibling;
    if (lastSibling) {
      lastSibling.nextSibling = newSibling;
    }
    nodes.push(newSibling);
  }
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
  const func = Function("context", `"use strict";return context.${expression}`);
  try {
    const value = func(context);
    return value;
  } catch (err) {
    return err;
  }
}
