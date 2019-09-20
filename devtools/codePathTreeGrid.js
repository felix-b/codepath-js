define(function (require) {
  console.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "loaded");

  const CodePath = require('codepath');
  const model = CodePath.createCodePathModel();
  let controller = undefined;
  let searchModel = undefined;

  return {
    initMvc(gridTableElement) {
      console.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "initMvc");
      const view = CodePath.createTreeGridView(gridTableElement, createColumns());
      controller = CodePath.createTreeGridController(view, model);
      return controller;
    },
    receiveEntries(entries) {
      console.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "receiveEntries", entries);
      model.publish(entries);
    },
    search(text) {
      if (searchModel) {
        //searchModel.unsubscribeFromSource();
        searchModel = undefined;
      }
      const trimmedText = text.trim();
      if (trimmedText.length > 0) {
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
        searchModel = CodePath.createCodePathSearchModel(model, predicate);
        controller.replaceModel(searchModel);
      } else {
        controller.replaceModel(model);
      }
    }
  };

  function createColumns() {
    const indentSizePx = 20;
    const columns = [
      createMessageColumn(),
      createTimeColumn(),
      createDetailsColumn()
    ];

    return columns;

    function createMessageColumn() {
      return {
        renderCell(node, controller, rowIndex) {
          const isExpanded = controller.getIsExpanded(node.id);
          const renderIndent = (size) => {
            const span = document.createElement('span');
            span.style.cssText = `width:${size * indentSizePx}px;display:inline-block;`;
            return span;
          };
          const renderToggleAnchor = () => {
            const anchor = document.createElement('a');
            anchor.style.cssText = `width:${indentSizePx}px;display:inline-block;`;
            anchor.onclick = () => {
              controller.toggle(node.id);
            };
            anchor.innerHTML = isExpanded ? '[-]' : '[+]';
            return anchor;
          };
          return [
            renderIndent(node.firstChild ? node.depth : node.depth + 1),
            node.firstChild ? renderToggleAnchor() : undefined,
            `${node.entry.messageId}`
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
