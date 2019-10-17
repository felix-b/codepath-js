import {
  createRootNode,
  createRegularNode,
  appendChildNodeToParent,
  getNodesAsFlatArray,
  getTopLevelNodesAsArray,
  walkNodesDepthFirst,
  findNextMatchingNode,
  findPrevMatchingNode
} from "./codePathModel";

import { createMulticastDelegate } from "./multicastDelegate";

export function createCodePathFlatFilterModel(sourceModel, predicate) {
  const insertNodesCallbacks = createMulticastDelegate(
    "CodePathFlatFilterModel.insertNodes"
  );
  const updateNodesCallbacks = createMulticastDelegate(
    "CodePathFlatFilterModel.updateNodes"
  );

  let resultNodeById = {};
  let newlyCreatedResultNodes = undefined;
  let resultRootNode = undefined;

  const initializeFromSourceModel = () => {
    resultNodeById = {};
    newlyCreatedResultNodes = undefined;
    resultRootNode = performSearch();
  };

  const sourceModelSubscriber = {
    insertNodes: handleInsertedSourceNodes,
    updateNodes: handleUpdatedSourceNodes
  };

  sourceModel.subscribe(sourceModelSubscriber);
  initializeFromSourceModel();

  return {
    getRootNode() {
      return resultRootNode;
    },
    getNodesFlat() {
      return getNodesAsFlatArray(resultRootNode);
    },
    getTopLevelNodes() {
      return getTopLevelNodesAsArray(resultRootNode);
    },
    getFirstMatchedNode() {
      let firstMatchedNode = undefined;
      walkNodesDepthFirst(resultRootNode, node => {
        if (node.matched) {
          firstMatchedNode = node;
          return false;
        }
      });
      return firstMatchedNode;
    },
    getNextMatchedNode(matchedNode) {
      return findNextMatchingNode(matchedNode, node => node.matched);
    },
    getPrevMatchedNode(matchedNode) {
      return findPrevMatchingNode(matchedNode, node => node.matched);
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
    unsubscribeFromSource() {
      sourceModel.unsubscribe(sourceModelSubscriber);
    },
    clearAll() {
      sourceModel.clearAll();
      initializeFromSourceModel();
    }
  };

  function performSearch() {
    const sourceRootNode = sourceModel.getRootNode();
    const resultRootNode = createRootNode();
    resultNodeById[resultRootNode.id] = resultRootNode;

    depthFirstSearchSubTree(sourceRootNode, () => resultRootNode);

    return resultRootNode;
  }

  function depthFirstSearchSubTree(node, getResultParentNode) {
    const createThisResultNode = matched => {
      return createResultNode(node, matched, getResultParentNode);
    };

    const isRootNode = !node.parent;
    const thisNodeMatched = !isRootNode && predicate(node);
    let thisResultNode = thisNodeMatched
      ? createThisResultNode(true)
      : undefined;

    for (
      let subNode = node.firstChild;
      !!subNode;
      subNode = subNode.nextSibling
    ) {
      depthFirstSearchSubTree(subNode, getResultParentNode);
    }
  }

  function createResultNode(sourceNode, matched, getResultParentNode) {
    const resultParentNode = getResultParentNode();
    let resultNode = createRegularNode(
      sourceNode.id,
      resultParentNode,
      sourceNode.entry,
      sourceModel.extractEntryMetrics
    );
    resultNodeById[resultNode.id] = resultNode;
    if (newlyCreatedResultNodes) {
      newlyCreatedResultNodes.push(resultNode);
    }
    appendChildNodeToParent(resultNode, resultParentNode);
    resultNode.sourceNode = sourceNode;
    resultNode.matched = matched;
    return resultNode;
  }

  function handleInsertedSourceNodes(insertedNodes) {
    newlyCreatedResultNodes = [];
    const matchingNodes = insertedNodes.filter(predicate);

    matchingNodes.forEach(sourceNode => {
      createResultNode(sourceNode, true, () => resultRootNode);
    });

    if (newlyCreatedResultNodes.length > 0) {
      insertNodesCallbacks.invoke(newlyCreatedResultNodes);
    }
    newlyCreatedResultNodes = undefined;
  }

  function handleUpdatedSourceNodes(updatedNodes) {}
}
