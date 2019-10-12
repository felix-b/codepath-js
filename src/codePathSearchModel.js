import {
  createRootNode,
  createRegularNode,
  appendChildNodeToParent,
  getNodesAsFlatArray,
  getTopLevelNodesAsArray,
  walkNodesDepthFirst
} from "./codePathModel";

import { createMulticastDelegate } from "./multicastDelegate";

export function createCodePathSearchModel(sourceModel, predicate) {
  const insertNodesCallbacks = createMulticastDelegate(
    "CodePathSearchModel.insertNodes"
  );
  const updateNodesCallbacks = createMulticastDelegate(
    "CodePathSearchModel.updateNodes"
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
      let currentNode = matchedNode;
      let finishedSubTree = false;

      while (currentNode) {
        if (!finishedSubTree && currentNode.firstChild) {
          currentNode = currentNode.firstChild;
        } else {
          finishedSubTree = false;
          if (currentNode.nextSibling) {
            currentNode = currentNode.nextSibling;
          } else {
            finishedSubTree = true;
            currentNode = currentNode.parent;
          }
        }

        if (!finishedSubTree && currentNode.matched) {
          return currentNode;
        }
      }
    },
    getPrevMatchedNode(matchedNode) {
      let currentNode = matchedNode;
      let finishedSubTree = false;

      while (currentNode) {
        if (!finishedSubTree && currentNode.firstChild) {
          currentNode = currentNode.firstChild;
        } else {
          finishedSubTree = false;
          if (currentNode.nextSibling) {
            currentNode = currentNode.nextSibling;
          } else {
            finishedSubTree = true;
            currentNode = currentNode.parent;
          }
        }

        if (!finishedSubTree && currentNode.matched) {
          return currentNode;
        }
      }
    },
    subscribe(callback) {
      insertNodesCallbacks.add(callback);
    },
    unsubscribe(callback) {
      insertNodesCallbacks.remove(callback);
    },
    unsubscribeFromSource() {
      sourceModel.unsubscribe(handleInsertedSourceNodes);
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
      depthFirstSearchSubTree(subNode, () => {
        if (!thisResultNode) {
          thisResultNode = isRootNode
            ? getResultParentNode()
            : createThisResultNode(false);
        }
        return thisResultNode;
      });
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
    resultNode.matched = matched;
    return resultNode;
  }

  function getOrCreateResultParentNode(sourceChildNode) {
    if (!sourceChildNode.parent) {
      return;
    }
    const existingParent = resultNodeById[sourceChildNode.parent.id];
    if (existingParent) {
      return existingParent;
    }
    return createResultNode(sourceChildNode.parent, false, () =>
      getOrCreateResultParentNode(sourceChildNode.parent)
    );
  }

  function handleInsertedSourceNodes(insertedNodes) {
    newlyCreatedResultNodes = [];
    const matchingNodes = insertedNodes.filter(predicate);

    matchingNodes.forEach(sourceNode => {
      const getParentNode = () => {
        return getOrCreateResultParentNode(sourceNode);
      };
      createResultNode(sourceNode, true, getParentNode);
    });

    if (newlyCreatedResultNodes.length > 0) {
      insertNodesCallbacks.invoke(newlyCreatedResultNodes);
    }
    newlyCreatedResultNodes = undefined;
  }

  function handleUpdatedSourceNodes(updatedNodes) {}
}
