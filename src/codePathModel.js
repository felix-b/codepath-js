export function createCodePathModel() {
  const traceNodeMap = createTraceNodeMap();
  const rootNode = createRootNode();
  let nextNodeId = 1;
  let subscriber = undefined;

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
    publish(entries) {
      const insertedNodes = entries
        .filter(
          entry => entry.token !== "EndSpan" && entry.token !== "StartTracer"
        )
        .map(insertNode);

      subscriber && subscriber(insertedNodes);
    },
    subscribe(callback) {
      subscriber = callback;
    },
    unsubscribe(callback) {
      if (subscriber === callback) {
        subscriber = undefined;
      }
    },
    // expandRow(id) {

    // },
    // collapseRow(id) {

    // },
    // filterRows(query) {

    // },
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
  const pushSubTreeNodes = node => {
    for (
      let subNode = node.firstChild;
      !!subNode;
      subNode = subNode.nextSibling
    ) {
      flatNodes.push(subNode);
      pushSubTreeNodes(subNode);
    }
  };
  pushSubTreeNodes(rootNode);
  return flatNodes;
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
