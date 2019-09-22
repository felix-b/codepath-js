import { createMulticastDelegate } from "./multicastDelegate";

export function createCodePathModel() {
  const traceNodeMap = createTraceNodeMap();
  const rootNode = createRootNode();
  const subscribers = createMulticastDelegate("CodePathModel.EntriesPublished");

  let nextNodeId = 1;

  const getParentContext = entry => {
    if (entry.token === "StartSpan") {
      return entry.childOf || entry.followsFrom;
    } else {
      return entry;
    }
  };

  const findParentNode = entry => {
    const parentContext = getParentContext(entry);
    if (parentContext) {
      const parentNode = traceNodeMap.getSpanNode(
        parentContext.traceId,
        parentContext.spanId
      );
      if (parentNode) {
        return parentNode;
      }
      console.warn("CODEPATH.MODEL>", "Span node not found", parentContext);
    }
    return rootNode;
  };

  const insertNode = entry => {
    const { traceId, spanId } = entry;
    const parent = findParentNode(entry);
    const newNode = createRegularNode(nextNodeId++, parent, entry);

    appendChildNodeToParent(newNode, parent);
    if (entry.token === "StartSpan") {
      traceNodeMap.setSpanNode(traceId, spanId, newNode);
    }

    return newNode;
  };

  return {
    getRootNode() {
      return rootNode;
    },
    getNodesFlat() {
      return getNodesAsFlatArray(rootNode);
    },
    getTopLevelNodes() {
      return getTopLevelNodesAsArray(rootNode);
    },
    walkNodesDepthFirst(callback) {
      walkNodesDepthFirst(rootNode, callback);
    },
    publish(entries) {
      const insertedNodes = entries
        .filter(
          entry => entry.token !== "EndSpan" && entry.token !== "StartTracer"
        )
        .map(insertNode);

      subscribers.invoke(insertedNodes);
    },
    subscribe(callback) {
      subscribers.add(callback);
    },
    unsubscribe(callback) {
      subscribers.remove(callback);
    },
    // deleteRow(id) {
    // },
    clearAllRows() {}
  };
}

export function createRootNode() {
  return {
    id: 0,
    entry: undefined,
    parent: undefined,
    depth: -1,
    firstChild: undefined,
    lastChild: undefined,
    prevSibling: undefined,
    nextSibling: undefined
  };
}

export function createRegularNode(id, parent, entry) {
  return {
    id,
    entry,
    parent,
    depth: parent.depth + 1,
    firstChild: undefined,
    lastChild: undefined,
    prevSibling: undefined,
    nextSibling: undefined
  };
}

export function appendChildNodeToParent(newChild, parent) {
  if (parent.lastChild) {
    newChild.prevSibling = parent.lastChild;
    parent.lastChild.nextSibling = newChild;
  } else {
    parent.firstChild = newChild;
  }
  parent.lastChild = newChild;
}

export function getNodesAsFlatArray(rootNode) {
  if (!rootNode) {
    return [];
  }
  const flatNodes = [];
  walkNodesDepthFirst(rootNode, node => flatNodes.push(node));
  return flatNodes;
}

export function getTopLevelNodesAsArray(rootNode) {
  const topLevelNodes = [];
  walkImmediateSubNodes(rootNode, node => {
    topLevelNodes.push(node);
  });
  return topLevelNodes;
}

export function walkNodesDepthFirst(rootNode, callback) {
  return walkImmediateSubNodes(rootNode, node => {
    if (callback(node) === false) {
      return false;
    }
    if (node.firstChild) {
      if (walkNodesDepthFirst(node, callback) === false) {
        return false;
      }
    }
  });
}

export function walkImmediateSubNodes(parentNode, callback) {
  if (parentNode) {
    for (let node = parentNode.firstChild; !!node; node = node.nextSibling) {
      if (callback(node) === false) {
        return false;
      }
    }
  }
}

function createTraceNodeMap() {
  let mapByTraceId = {};

  const getOrAddTraceSpanNodeMap = traceId => {
    const existingMap = mapByTraceId[traceId];
    if (existingMap) {
      return existingMap;
    }

    const newMap = createSpanNodeMap();
    mapByTraceId[traceId] = newMap;
    return newMap;
  };

  return {
    getSpanNode(traceId, spanId) {
      const spanNodeMap = getOrAddTraceSpanNodeMap(traceId);
      return spanNodeMap.getSpanNode(spanId);
    },
    setSpanNode(traceId, spanId, node) {
      const spanNodeMap = getOrAddTraceSpanNodeMap(traceId);
      return spanNodeMap.setSpanNode(spanId, node);
    }
  };
}

function createSpanNodeMap() {
  let nodeBySpanId = {};

  return {
    getSpanNode(spanId) {
      return nodeBySpanId[spanId];
    },
    setSpanNode(spanId, node) {
      nodeBySpanId[spanId] = node;
    }
  };
}
