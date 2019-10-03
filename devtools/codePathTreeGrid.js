define(function (require) {
  const CodePath = require('codepath');
  const debug = CodePath.createDebugLog('devtool');

  debug.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "loaded");

  const model = CodePath.createCodePathModel();
  let controller = undefined;
  let searchModel = undefined;
  let selectedNode = undefined;

  return {
    initMvc(gridTableElement) {
      debug.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "initMvc");
      const view = CodePath.createTreeGridView(gridTableElement, createColumns());
      controller = CodePath.createTreeGridController(view, model);
      controller.onNodeSelected(node => {
        selectedNode = node;
      });
      return controller;
    },
    receiveEntries(entries) {
      debug.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "receiveEntries", entries);
      model.publish(entries);
    },
    applyFilter(text) {
      if (searchModel) {
        searchModel.unsubscribeFromSource();
        searchModel = undefined;
      }
      const trimmedText = text.trim();
      if (trimmedText.length > 0) {
        searchModel = performSearch(trimmedText);
        controller.replaceModel(searchModel);
        const firstMatchedNode = searchModel.getFirstMatchedNode();
        controller.selectNode(firstMatchedNode);
      } else {
        controller.replaceModel(model);
      }
    },
    goToNode(text, nextOrPrev) {
      if (searchModel) {
        const nextNode = selectedNode 
          ? searchModel.getNextMatchedNode(selectedNode)
          : searchModel.getFirstMatchedNode();
        controller.selectNode(nextNode);
      }
    }
  };

  function performSearch(trimmedText) {
    const predicate = (node) => {
      if (!node.entry) {
        return false;
      }
      const messageId = node.entry.messageId;
      if (typeof messageId !== 'string') {
        return false;
      }
      return (messageId.indexOf(trimmedText) >= 0);
    };
    return CodePath.createCodePathSearchModel(model, predicate);
  }

  function createColumns() {
    const columns = [
      createMessageColumn(),
      createTimeColumn(),
      createDetailsColumn()
    ];

    return columns;

    function createMessageColumn() {
      return {
        renderCell(node, controller, rowIndex) {
          const renderIndents = (size) => {
            const indents = [];
            for (let i = 0 ; i < size ; i++) {
              const span = document.createElement('span');
              span.classList.add('indent');
              indents.push(span);
            }
            return indents;
          };
          const renderToggleAnchor = () => {
            const span = document.createElement('span');
            span.classList.add('toggle');
            span.onclick = () => {
              controller.toggle(node.id);
            };
            return span;
          };
          const renderText = () => {
            const span = document.createElement('span');
            span.classList.add('data');
            span.innerHTML = `${node.entry.messageId}`;  
            return span;
          };
          return [
            ...renderIndents(node.firstChild ? node.depth : node.depth + 1),
            node.firstChild ? renderToggleAnchor() : undefined,
            renderText()
          ];
        }
      };
    }

    function createTimeColumn() {
      return {
        renderCell(node, controller, trIndex) {
          return [`${node.entry.time}`];
        }
      };
    }

    function createDetailsColumn() {
      return {
        renderCell(node, controller, trIndex) {
          return [`details...`];
        }
      };
    }

  }

});
