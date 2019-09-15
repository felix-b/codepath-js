define(function (require) {
  console.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "loaded");

  const CodePath = require('codepath');
  const model = CodePath.createCodePathModel();

  return {
    initMvc(gridTableElement) {
      console.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "initMvc");
      const view = CodePath.createTreeGridView(gridTableElement, createColumns());
      const controller = CodePath.createTreeGridController(view, model);
      return controller;
    },
    receiveEntries(entries) {
      console.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "receiveEntries", entries);
      model.publish(entries);
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
