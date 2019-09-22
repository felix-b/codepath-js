import { createMulticastDelegate } from "./multicastDelegate";

export function createTreeGridController(view, model) {
  let rowById = {};
  let masterIndexVersion = 1;

  const controller = {
    toggle(id) {
      return rowById[id].toggle();
    },
    expand(id) {
      rowById[id].expand();
    },
    collapse(id) {
      rowById[id].collapse();
    },
    selectNode(node) {
      controller.expandToNode(node);
      const nodeRow = rowById[node.id];
      const nodeRowIndex = nodeRow.findAbsoluteIndex();
      view.selectNode(nodeRowIndex, node);
    },
    expandToNode(node) {
      if (!rowById[node.id]) {
        controller.expandToNode(node.parent);
        controller.expand(node.parent.id);
      }
    },
    getIsExpanded(id) {
      return rowById[id].getIsExpanded();
    },
    getIsVisible(id) {
      return rowById[id].getIsVisible();
    },
    replaceModel(newModel) {
      model.unsubscribe(subscriber);
      model = newModel;
      initWithCurrentModel();
    },
    clearAll() {
      rowById = {};
      masterIndexVersion = 1;
      initRootNode();
      view.clearAll();
    },
    onNodeSelected(callback) {
      view.onNodeSelected(callback);
    }
  };

  view.attachController(controller);
  initWithCurrentModel();

  return controller;

  function initWithCurrentModel() {
    controller.clearAll();
    subscriber(model.getTopLevelNodes());
    model.subscribe(subscriber);
  }

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
      return node.prevSibling ? rowById[node.prevSibling.id] : undefined;
    };
    const getNextSibling = () => {
      return node.nextSibling ? rowById[node.nextSibling.id] : undefined;
    };
    const getFirstChild = () => {
      return node.firstChild ? rowById[node.firstChild.id] : undefined;
    };
    const getIsExpanded = () => {
      return isExpanded;
    };
    const getIsVisible = () => {
      const parent = getParent();
      return parent.getIsVisible() && parent.getIsExpanded();
    };
    const getSubTreeHeight = () => {
      return subTreeHeight;
    };
    const updateSubTreeHeight = delta => {
      subTreeHeight += delta;
      cachedIndexVersion = masterIndexVersion;
      getParent().updateSubTreeHeight(delta);
    };
    const getIndexVersion = () => {
      return masterIndexVersion;
    };
    const isCachedAbsoluteIndexValid = () => {
      return !!cachedAbsoluteIndex && cachedIndexVersion === masterIndexVersion;
    };
    const findAbsoluteIndex = () => {
      if (!isCachedAbsoluteIndexValid()) {
        let indexRelativeToParent = 0;
        for (
          let sibling = getPrevSibling();
          !!sibling;
          sibling = sibling.getPrevSibling()
        ) {
          indexRelativeToParent += 1 + sibling.getSubTreeHeight();
        }
        const parentAbsoluteIndex = getParent().findAbsoluteIndex();
        cachedAbsoluteIndex = parentAbsoluteIndex + indexRelativeToParent + 1;
        cachedIndexVersion = masterIndexVersion;
      }
      return cachedAbsoluteIndex;
    };
    const showSubNodes = subNodes => {
      if (!getIsVisible() || !getIsExpanded()) {
        return;
      }
      const thisRowIndex = findAbsoluteIndex();
      createSubNodesRowControllers(subNodes);
      view.insertNodes(thisRowIndex + subTreeHeight + 1, subNodes);
      masterIndexVersion++;
      updateSubTreeHeight(+subNodes.length);
      view.updateNode(thisRowIndex, node);
    };
    const hideSubNodes = () => {
      if (!getIsVisible() || subTreeHeight === 0) {
        return;
      }
      const thisRowIndex = findAbsoluteIndex();
      view.removeNodes(thisRowIndex + 1, subTreeHeight);
      masterIndexVersion++;
      updateSubTreeHeight(-subTreeHeight);
      view.updateNode(thisRowIndex, node);
    };
    const toggle = () => {
      if (isExpanded) {
        collapse();
      } else {
        expand();
      }
      return {
        isExpanded
      };
    };
    const expand = () => {
      if (isExpanded || !node.firstChild) {
        return;
      }
      const subNodes = [];
      for (
        let subNode = node.firstChild;
        !!subNode;
        subNode = subNode.nextSibling
      ) {
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
      showSubNodes
    };
  }

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
    };
  }

  function subscriber(insertedNodes) {
    let currentGroup = undefined;

    for (let i = 0; i < insertedNodes.length; i++) {
      const parentId = insertedNodes[i].parent.id;
      const parentRow = rowById[parentId];
      if (!currentGroup || currentGroup.parentId !== parentId) {
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
        if (parentRow) {
          const nodesInGroup = insertedNodes.slice(
            currentGroup.startIndex,
            index
          );
          parentRow.showSubNodes(nodesInGroup);
        }
      }
    }
  }

  function initRootNode() {
    const rootNode = model.getRootNode();
    rowById[rootNode.id] = createRootNodeController(rootNode);
  }
}

export function createTreeGridView(table, columns) {
  const nodeSelectedCallbacks = createMulticastDelegate(
    "TreeGridView.NodeSelected"
  );

  let tbody = document.createElement("tbody");
  table.appendChild(tbody);

  let controller = undefined;
  let selectedTr = undefined;

  const stringToTextNode = element => {
    if (typeof element === "string") {
      return document.createTextNode(element);
    }
    return element;
  };

  const renderCell = (node, rowIndex, colIndex, tr, td) => {
    const tdContents = columns[colIndex].renderCell(node, controller, rowIndex);
    tdContents
      .filter(htmlNode => !!htmlNode)
      .map(stringToTextNode)
      .forEach(htmlNode => td.appendChild(htmlNode));
  };

  const attachController = theController => {
    controller = theController;
  };

  const updateNode = (index, node) => {
    const tr = tbody.rows[index];
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const td = tr.cells[colIndex];
      td.innerHTML = "";
      renderCell(node, index, colIndex, tr, td);
    }
  };

  const selectNode = (index, node) => {
    if (selectedTr) {
      selectedTr.classList.remove("selected");
    }
    selectedTr = undefined;
    if (typeof index === "number" && index >= 0) {
      selectedTr = tbody.rows[index];
      selectedTr.classList.add("selected");
      nodeSelectedCallbacks.invoke(node);
      selectedTr.scrollIntoViewIfNeeded(); //TODO
    }
  };

  const insertNodes = (index, nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      const rowIndex = index + i;
      const tr = tbody.insertRow(index + i);
      tr.onclick = () => {
        selectNode(tr.rowIndex - 1, nodes[i]);
      };
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const td = tr.insertCell(colIndex);
        renderCell(nodes[i], rowIndex, colIndex, tr, td);
      }
    }
  };

  const removeNodes = (index, count) => {
    if (
      selectedTr &&
      selectedTr.rowIndex - 1 >= index &&
      selectedTr.rowIndex - 1 < index + count
    ) {
      selectedTr = undefined;
      nodeSelectedCallbacks.invoke(undefined);
    }
    for (let i = count - 1; i >= 0; i--) {
      tbody.deleteRow(index + i);
    }
  };

  const clearAll = () => {
    const newTbody = document.createElement("tbody");
    table.replaceChild(newTbody, tbody);
    tbody = newTbody;
    nodeSelectedCallbacks.invoke(undefined);
  };

  const onNodeSelected = callback => {
    nodeSelectedCallbacks.add(callback);
  };

  return {
    attachController,
    updateNode,
    insertNodes,
    removeNodes,
    selectNode,
    clearAll,
    onNodeSelected
  };
}
