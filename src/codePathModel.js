import { createMulticastDelegate } from "./multicastDelegate";

export function createCodePathModel(options) {
  const insertNodesCallbacks = createMulticastDelegate(
    "CodePathModel.insertNodes"
  );
  const updateNodesCallbacks = createMulticastDelegate(
    "CodePathModel.updateNodes"
  );
  const extractEntryMetrics =
    options && options.extractEntryMetrics
      ? options.extractEntryMetrics
      : entry => entry.metrics;

  let traceNodeMap = undefined;
  let rootNode = undefined;
  let nextNodeId = 1;

  const initializeModel = () => {
    traceNodeMap = createTraceNodeMap();
    rootNode = createRootNode();
  };

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

  const bubbleSingleMetric = (targetNode, key, value) => {
    if (!targetNode.metrics) {
      targetNode.metrics = { [key]: value };
    } else if (!targetNode.metrics[key]) {
      targetNode.metrics[key] = value;
    } else {
      targetNode.metrics[key] += value;
    }
  };

  const bubbleMetrics = (node, insertQueue, updateQueue) => {
    if (!node.metrics) {
      return;
    }
    const insertSet = new Set(insertQueue);
    const metricKeys = Object.keys(node.metrics);
    for (
      let targetNode = node.parent;
      targetNode.id > 0;
      targetNode = targetNode.parent
    ) {
      metricKeys.forEach(key => {
        const value = node.metrics[key];
        bubbleSingleMetric(targetNode, key, value);
      });
      if (!insertSet.has(targetNode)) {
        updateQueue.push(targetNode);
      }
    }
  };

  const handleInsertNodeEntry = (entry, insertQueue, updateQueue) => {
    const { traceId, spanId } = entry;
    const parent = findParentNode(entry);
    const newNode = createRegularNode(
      nextNodeId++,
      parent,
      entry,
      extractEntryMetrics
    );

    appendChildNodeToParent(newNode, parent);
    if (entry.token === "StartSpan") {
      traceNodeMap.setSpanNode(traceId, spanId, newNode);
    }

    insertQueue.push(newNode);
    bubbleMetrics(newNode, insertQueue, updateQueue);
  };

  const handleSpanTagsEntry = (entry, insertQueue, updateQueue) => {};

  const handleEndSpanEntry = (entry, insertQueue, updateQueue) => {
    const node = traceNodeMap.getSpanNode(entry.traceId, entry.spanId);
    if (node) {
      node.entry.duration = entry.time - node.entry.time;
      updateQueue.push(node);
    }
  };

  const handleStartTracerEntry = (entry, insertQueue, updateQueue) => {};

  const entryHandlerByToken = {
    StartTracer: handleStartTracerEntry,
    StartSpan: handleInsertNodeEntry,
    Log: handleInsertNodeEntry,
    SpanTags: handleSpanTagsEntry,
    EndSpan: handleEndSpanEntry
  };

  const handleEntry = (entry, insertQueue, updateQueue) => {
    const handler = entryHandlerByToken[entry.token];
    if (handler) {
      handler(entry, insertQueue, updateQueue);
    } else {
      console.error(`Unknown entry token [${entry.token}]`);
    }
  };

  initializeModel();

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
      const insertQueue = [];
      const updateQueue = [];
      entries.forEach(entry => {
        handleEntry(entry, insertQueue, updateQueue);
      });
      if (insertQueue.length > 0) {
        insertNodesCallbacks.invoke(insertQueue);
      }
      if (updateQueue.length > 0) {
        updateNodesCallbacks.invoke(updateQueue);
      }
    },
    subscribe(subscriber) {
      if (subscriber.insertNodes) {
        insertNodesCallbacks.add(subscriber.insertNodes);
      }
      if (subscriber.updateNodes) {
        updateNodesCallbacks.add(subscriber.updateNodes);
      }
    },
    unsubscribe(subscriber) {
      if (subscriber.insertNodes) {
        insertNodesCallbacks.remove(subscriber.insertNodes);
      }
      if (subscriber.updateNodes) {
        updateNodesCallbacks.remove(subscriber.updateNodes);
      }
    },
    // deleteRow(id) {
    // },
    clearAll() {
      initializeModel();
    },
    extractEntryMetrics
  };
}

export function createRootNode() {
  return {
    id: 0,
    entry: undefined,
    parent: undefined,
    top: undefined,
    depth: -1,
    firstChild: undefined,
    lastChild: undefined,
    prevSibling: undefined,
    nextSibling: undefined,
    metrics: undefined
  };
}

export function createRegularNode(id, parent, entry, extractEntryMetrics) {
  const node = {
    id,
    entry,
    parent,
    depth: parent.depth + 1,
    top: parent.top,
    firstChild: undefined,
    lastChild: undefined,
    prevSibling: undefined,
    nextSibling: undefined,
    metrics: extractEntryMetrics ? extractEntryMetrics(entry) : entry.metrics
  };
  if (!node.top) {
    node.top = node;
  }
  return node;
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
