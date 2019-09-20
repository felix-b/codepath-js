import {
  createRootNode,
  createRegularNode,
  appendChildNodeToParent,
  getNodesAsFlatArray
} from "./codePathModel";

export function createCodePathSearchModel(sourceModel, predicate) {
  let subscriber = undefined;
  let resultNodeById = {};

  const resultRootNode = performSearch();
  sourceModel.subscribe(sourceModelSubscriber);

  return {
    getRootNode() {
      return resultRootNode;
    },
    getNodesFlat() {
      return getNodesAsFlatArray(resultRootNode);
    },
    subscribe(callback) {
      subscriber = callback;
    },
    unsubscribe(callback) {
      if (subscriber === callback) {
        subscriber = undefined;
      }
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
      sourceNode.entry
    );
    resultNodeById[resultNode.id] = resultNode;
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

  function sourceModelSubscriber(insertedNodes) {
    const matchingNodes = insertedNodes.filter(predicate);
    const newResultNodes = [];

    matchingNodes.forEach(sourceNode => {
      const getParentNode = () => {
        return getOrCreateResultParentNode(sourceNode);
      };
      const resultNode = createResultNode(sourceNode, true, getParentNode);
      newResultNodes.push(resultNode);
    });

    subscriber && subscriber(newResultNodes);
  }
}
