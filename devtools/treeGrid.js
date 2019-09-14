export function createTreeGridController(view, model) {

  let rowById = {};
  let masterIndexVersion = 1;

  const controller = {
    toggle(id) {
      rowById[id].toggle();
    },
    expand(id) {
      rowById[id].expand();
    },
    collapse(id) {
      rowById[id].collapse();
    },
    clearAll() {

    }
  };

  initRootNode();
  view.attachController(controller);
  model.subscribe(subscriber);

  return controller;

  function createSubNodesRowControllers(subNodes) {
    for (let node of subNodes) {
      const row = createRowController(node);
      rowById[node.id] = row;
    }
  }

  function createRowController(node) {
    let isExpanded = false;
    let subTreeHeight = 0;
    let cachedAbsoluteIndex = undefined;
    let cachedIndexVersion = masterIndexVersion;

    const getNode = () => {
      return node;
    };
    const getParent = () => {
      return rowById[node.parent.id];
    };
    const getPrevSibling = () => {
      return (node.prevSibling ? rowById[node.prevSibling.id] : undefined);
    };
    const getNextSibling = () => {
      return (node.nextSibling ? rowById[node.nextSibling.id] : undefined);
    };
    const getFirstChild = () => {
      return (node.firstChild ? rowById[node.firstChild.id] : undefined);
    };
    const getIsExpanded = () => {
      return isExpanded;
    };
    const getIsVisible = () => {
      const parent = getParent();
      return (parent.getIsVisible() && parent.getIsExpanded());
    };
    const getSubTreeHeight = () => {
      return subTreeHeight;
    };
    const updateSubTreeHeight = (delta) => {
      subTreeHeight += delta;
      cachedIndexVersion = masterIndexVersion;
      getParent().updateSubTreeHeight(delta);
    };
    const getIndexVersion = () => {
      return masterIndexVersion;
    };
    const isCachedAbsoluteIndexValid = () => {
      return (
        !!cachedAbsoluteIndex && 
        cachedIndexVersion === masterIndexVersion);
    };
    const findAbsoluteIndex = () => {
      if (!isCachedAbsoluteIndexValid()) {
        let indexRelativeToParent = 0;
        for (
          let sibling = getPrevSibling(); 
          !!sibling; 
          sibling = sibling.getPrevSibling())
        {
          indexRelativeToParent += 1 + sibling.getSubTreeHeight();
        }
        const parentAbsoluteIndex = getParent().findAbsoluteIndex();
        cachedAbsoluteIndex = parentAbsoluteIndex + indexRelativeToParent + 1;
        cachedIndexVersion = masterIndexVersion;
      }
      return cachedAbsoluteIndex;
    };
    const showSubNodes = (subNodes) => {
      if (!getIsVisible()) {
        return;
      }
      createSubNodesRowControllers(subNodes);
      view.insertNodes(findAbsoluteIndex() + subTreeHeight + 1, subNodes);
      masterIndexVersion++;
      updateSubTreeHeight(+subNodes.length);
    };
    const hideSubNodes = () => {
      if (!getIsVisible() || subTreeHeight === 0) {
        return;
      }
      view.removeNodes(findAbsoluteIndex() + 1, subTreeHeight);
      masterIndexVersion++;
      updateSubTreeHeight(-subTreeHeight);
    };
    const toggle = () => {
      if (isExpanded) {
        collapse();
      } else {
        expand();
      }
    };
    const expand = () => {
      if (isExpanded || !node.firstChild) {
        return;
      }
      const subNodes = [];
      for (let subNode = node.firstChild ; !!subNode ; subNode = subNode.nextSibling) {
        subNodes.push(subNode);          
      }
      isExpanded = true;
      showSubNodes(subNodes);
    };
    const collapse = () => {
      isExpanded = false;
      hideSubNodes();
    };

    return {
      getNode,
      getParent,
      getPrevSibling,
      getNextSibling,
      getFirstChild,
      getIsExpanded,
      getIsVisible,
      getSubTreeHeight,
      updateSubTreeHeight,
      getIndexVersion,
      findAbsoluteIndex,
      toggle,
      expand,
      collapse,
      showSubNodes,
    };
  };

  function createRootNodeController(rootNode) {
    let subTreeHeight = 0;
    const noop = () => {};

    return {
      getNode: () => rootNode,
      getParent: noop,
      getPrevSibling: noop,
      getNextSibling: noop,
      getFirstChild: noop,
      getIsExpanded: () => true,
      getIsVisible: () => true,
      getSubTreeHeight: () => subTreeHeight, 
      updateSubTreeHeight(delta) {
        subTreeHeight += delta;
      },
      getIndexVersion: () => masterIndexVersion,
      findAbsoluteIndex: () => -1,
      toggle: noop,
      expand: noop,
      collapse: noop,
      showSubNodes(subNodes) {
        createSubNodesRowControllers(subNodes);
        view.insertNodes(subTreeHeight, subNodes);
        subTreeHeight += subNodes.length;
      }
    }
  }

  function subscriber(insertedNodes) {
    let currentGroup = undefined;

    for (let i = 0 ; i < insertedNodes.length ; i++) {
      if (!currentGroup || currentGroup.parentId !== insertedNodes[i].parent.id) {
        beginNewGroup(i);
      }
    }
    
    endCurrentGroup(insertedNodes.length);

    function beginNewGroup(index) {
      endCurrentGroup(index);
      currentGroup = {
        parentId: insertedNodes[index].parent.id,
        startIndex: index
      };
    }
    
    function endCurrentGroup(index) {
      if (currentGroup && currentGroup.startIndex < index) {
        const parentRow = rowById[currentGroup.parentId];
        if (parentRow.getIsVisible()) {
          parentRow.showSubNodes(insertedNodes.slice(currentGroup.startIndex, index));
        }
      }
    }
  }

  function initRootNode() {
    const rootNode = model.getRootNode();
    rowById[rootNode.id] = createRootNodeController();
  };

}

export function createTreeGridView(tableEl, columns) {

  let controller = undefined;

  return {
    attachController(theController) {
      controller = theController;
    },
    insertNodes(index, nodes) {

    },
    removeNodes(index, count) {

    }
  };
}




