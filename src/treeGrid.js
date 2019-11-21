import { createMulticastDelegate } from "./multicastDelegate";
import { createCodePathModel } from "./codePathModel";

export function createTreeGridController(view, model) {
  let rowById = {};
  let masterIndexVersion = 1;

  //setInterval(() => console.log(rowById), 1000);

  const subscriber = {
    insertNodes: handleInsertedNodes,
    updateNodes: handleUpdatedNodes,
    removeNodes: handleRemovedNodes
  };

  const controller = {
    getNodeById(id) {
      const row = rowById[id];
      if (row) {
        return row.getNode();
      }
    },
    toggle(id) {
      return rowById[id].toggle();
    },
    expand(id) {
      rowById[id].expand();
    },
    collapse(id) {
      rowById[id].collapse();
    },
    removeNode(id) {
      rowById[id].remove();
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
      const row = rowById[id];
      return row ? row.getIsExpanded() : false;
    },
    getIsVisible(id) {
      const row = rowById[id];
      return row ? rowById[id].getIsVisible() : false;
    },
    replaceModel(newModel) {
      model.unsubscribe(subscriber);
      model = newModel;
      initWithCurrentModel();
    },
    clearAll() {
      model.clearAll();
      controller.replaceModel(model);
    },
    onNodeSelected(callback) {
      view.onNodeSelected(callback);
    }
  };

  view.attachController(controller);
  initWithCurrentModel();
  return controller;

  function initWithCurrentModel() {
    rowById = {};
    masterIndexVersion = 1;
    initRootNode();
    view.clearAll();
    subscriber.insertNodes(model.getTopLevelNodes());
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
      const removedNodeIds = view.removeNodes(thisRowIndex + 1, subTreeHeight);
      removedNodeIds && removedNodeIds.forEach(id => delete rowById[id]);
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
    const remove = () => {
      const thisRowIndex = findAbsoluteIndex();
      const removedNodeIds = view.removeNodes(thisRowIndex, subTreeHeight + 1);
      removedNodeIds && removedNodeIds.forEach(id => delete rowById[id]);
      masterIndexVersion++;
      updateSubTreeHeight(-(subTreeHeight + 1));
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
      remove,
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

  function handleInsertedNodes(insertedNodes) {
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

  function handleUpdatedNodes(updatedNodes) {
    updatedNodes.forEach(node => {
      const row = rowById[node.id];
      if (row) {
        const index = row.findAbsoluteIndex();
        view.updateNode(index, node);
      }
    });
  }

  function handleRemovedNodes(removedNodes) {
    removedNodes.forEach(node => {
      const row = rowById[node.id];
      if (row) {
        row.remove();
      }
    });
  }

  function initRootNode() {
    const rootNode = model.getRootNode();
    rowById[rootNode.id] = createRootNodeController(rootNode);
  }
}

export function createTreeGridView(table, columns, rows) {
  const nodeSelectedCallbacks = createMulticastDelegate(
    "TreeGridView.NodeSelected"
  );
  const keyPressedCallbacks = createMulticastDelegate(
    "TreeGridView.KeyPressed"
  );

  table.onkeydown = e => {
    if (handleTableKeyboardEvent(e) === true) {
      e.stopPropagation();
      return false;
    }
    keyPressedCallbacks.invoke(e);
    return !e.defaultPrevented;
  };

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
    const column = columns[colIndex];
    const tdClass =
      column.getTdClass && column.getTdClass(node, controller, rowIndex);
    tdClass && td.classList.add(tdClass);
    const tdContents = column.renderCell(node, controller, rowIndex);
    tdContents &&
      tdContents
        .filter(htmlNode => !!htmlNode)
        .map(stringToTextNode)
        .forEach(htmlNode => td.appendChild(htmlNode));
  };

  const attachController = theController => {
    controller = theController;
  };

  const applyTrClasses = (tr, node, index) => {
    const isExpanded = controller.getIsExpanded(node.id);
    tr.className = "";
    tr.classList.add(isExpanded ? "expanded" : "collapsed");
    if (tr === selectedTr) {
      tr.classList.add("selected");
    }
    if (rows && rows.getTrClasses) {
      const trClasses = rows.getTrClasses(node, index);
      tr.classList.add(...trClasses);
    }
  };

  const updateNode = (index, node) => {
    const tr = tbody.rows[index];
    applyTrClasses(tr, node, index);

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
      tr.setAttribute("data-nid", nodes[i].id);
      applyTrClasses(tr, nodes[i], index + i);
      tr.onclick = () => {
        selectNode(tr.rowIndex - 1, nodes[i]);
      };
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const td = tr.insertCell(colIndex);
        renderCell(nodes[i], rowIndex, colIndex, tr, td);
      }
      tr.insertCell(columns.length);
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
    const deletedNodeIds = [];
    for (let i = count - 1; i >= 0; i--) {
      const tr = tbody.rows[index + i];
      deletedNodeIds.push(getTrNodeId(tr));
      tbody.deleteRow(index + i);
    }
    return deletedNodeIds;
  };

  const clearAll = () => {
    const newTbody = document.createElement("tbody");
    table.replaceChild(newTbody, tbody);
    tbody = newTbody;
    selectNode();
  };

  const onNodeSelected = callback => {
    nodeSelectedCallbacks.add(callback);
  };

  const onKeyPressed = callback => {
    keyPressedCallbacks.add(callback);
  };

  return {
    attachController,
    updateNode,
    insertNodes,
    removeNodes,
    selectNode,
    clearAll,
    onNodeSelected,
    onKeyPressed
  };

  function handleTableKeyboardEvent(e) {
    if (e.ctrlKey || e.shiftKey || e.altKey) {
      return false;
    }

    if (!selectedTr) {
      if (tbody.rows.length > 0) {
        selectNode(0, getTrNode(tbody.rows[0]));
      }
      return true;
    }

    const selectedNodeId = getTrNodeId(selectedTr);

    switch (e.key) {
      case "ArrowLeft":
        if (controller.getIsExpanded(selectedNodeId)) {
          controller.collapse(selectedNodeId);
          return true;
        }
        break;
      case "ArrowRight":
        if (!controller.getIsExpanded(selectedNodeId)) {
          controller.expand(selectedNodeId);
          return true;
        }
        break;
    }

    const trToGo = getTrToGo(e.key);
    if (trToGo) {
      selectNode(getTrIndex(trToGo), getTrNode(trToGo));
      return true;
    }

    return false;
  }

  function getTrToGo(keyCode) {
    switch (keyCode) {
      case "ArrowUp":
        if (getTrIndex(selectedTr) > 0) {
          return tbody.rows[getTrIndex(selectedTr) - 1];
        }
        break;
      case "ArrowDown":
        if (getTrIndex(selectedTr) < tbody.rows.length - 1) {
          return tbody.rows[getTrIndex(selectedTr) + 1];
        }
        break;
      case "ArrowLeft":
        return findParentTr(selectedTr);
      case "ArrowRight":
        return findExpandableChildTr(selectedTr);
    }
  }

  function getTrIndex(tr) {
    return tr.sectionRowIndex;
  }

  function getTrNodeId(tr) {
    const nodeId = parseInt(tr.getAttribute("data-nid"));
    return !isNaN(nodeId) ? nodeId : undefined;
  }

  function getTrNode(tr) {
    const nodeId = getTrNodeId(tr);
    if (nodeId) {
      return controller.getNodeById(nodeId);
    }
  }

  function findParentTr(childTr) {
    const childNode = getTrNode(childTr);
    const parentNodeId = childNode.parent.id;
    if (parentNodeId) {
      for (let index = getTrIndex(childTr) - 1; index >= 0; index--) {
        const tr = tbody.rows[index];
        if (getTrNodeId(tr) === parentNodeId) {
          return tr;
        }
      }
    }
  }

  function findExpandableChildTr(parentTr) {
    const parentNode = getTrNode(parentTr);
    for (
      let index = getTrIndex(parentTr) + 1;
      index < tbody.rows.length;
      index++
    ) {
      const childTr = tbody.rows[index];
      const childNode = getTrNode(childTr);
      if (childNode.parent !== parentNode) {
        break;
      }
      if (childNode.firstChild) {
        return childTr;
      }
    }
  }
}
