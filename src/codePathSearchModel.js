import { 
  createRootNode, 
  createRegularNode, 
  appendChildNodeToParent,
  getNodesAsFlatArray
} from './codePathModel';

export function createCodePathSearchModel(sourceModel, predicate) {

  const resultRootNode = performSearch();

  return {
    getRootNode() {
      return resultRootNode;
    },
    getNodesFlat() {
      return getNodesAsFlatArray(resultRootNode);
    }
  };

  function performSearch() {
    const sourceRootNode = sourceModel.getRootNode();
    const resultRootNode = createRootNode();

    depthFirstSearchSubTree(sourceRootNode, () => resultRootNode);

    return resultRootNode;
  }

  function depthFirstSearchSubTree(node, getResultParentNode) {
    const createThisResultNode = (matched) => {
      return createResultNode(node, matched, getResultParentNode);
    }      

    const isRootNode = !node.parent;
    const thisNodeMatched = !isRootNode && predicate(node);
    let thisResultNode = thisNodeMatched
      ? createThisResultNode(true)
      : undefined;
    
    for (
      let subNode = node.firstChild ; 
      !!subNode ; 
      subNode = subNode.nextSibling) 
    {
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
    let resultNode = createRegularNode(sourceNode.id, resultParentNode, sourceNode.entry);
    appendChildNodeToParent(resultNode, resultParentNode);
    resultNode.matched = matched;
    return resultNode;
  };
} 