export function createCodePathVisualModel(onInsertRows, onRemoveRows) {

  const traceNodeMap = createTraceNodeMap();

  const rootNode = {
    id: 0, 
    entry: undefined,
    parentNode: undefined,
    subNodes: [],
    isExpanded: true,
    rowIndex: -1
  };

  let nextNodeId = 1;


  const getParentNode = (entry) => {
    const parentContext = entry.childOf || entry.followsFrom;
    if (parentContext) {
      const parentNode = traceNodeMap.getSpanNode(parentContext.traceId, parentContext.spanId);
      if (parentNode) {
        return parentNode;
      }
      console.warn('CODEPATH.VISUALIZER>', 'Span node not found', parentContext);
    }
    return rootNode;
  };

  return {
    publish(entries) {
      const entriesToInsert = entries.filter(e => e.token !== 'EndSpan');
      const nodesToInsert = entriesToInsert.map(e => ({
        id: nextNodeId++,
        entry: e,
      }));

      for (let node of nodesToInsert) {
        rootNode.subNodes.push(node);
      }

      onInsertRows(0, nodesToInsert);
    },
    expandRow(id) {

    },
    collapseRow(id) {

    },
    filterRows(query) {

    },
    deleteRow(id) {

    },
    clearAllRows() {

    }
  };
}

function getNodeRowIndex(node) {
  for (let current = node ; !!current ; current = current.parentNode) {
    const rowIndex = current.getRowIndex(); 
    if (rowIndex) {
      return rowIndex;
    }
  }
}

function createNode(parentNode, id, entry) {
  const data = { id, entry };
  const subNodes = [];
  let isExpanded = false;
  let rowIndex = undefined;

  return {
    getData() {
      return data;
    },
    getRowIndex() {
      return rowIndex;
    },
    isExpanded() {
      return isExpanded;
    },
    expand() {

    },
    collapse() {

    }
  }
}

function createTraceNodeMap() {
  let mapByTraceId = {};

  const getOrAddTraceSpanNodeMap = (traceId) => {
    const existingMap = mapByTraceId[traceId];
    if (existingMap) {
      return existingMap;
    }

    const newMap = createSpanNodeMap();
    mapByTraceId[traceId] = newMap;
    return newMap;
  }

  return {
    getSpanNode(traceId, spanId) {
      const spanNodeMap = getOrAddTraceSpanNodeMap(traceId);
      return spanNodeMap.getSpanNode(spanId);
    },
    setSpanNode(traceId, spanId, node) {
      const spanNodeMap = getOrAddTraceSpanNodeMap(traceId);
      return spanNodeMap.setSpanNode(spanId, node);
    }
  }
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
  }
}
