define(function (require) {
  const CodePath = require('codepath');
  const debug = CodePath.createDebugLog('devtool');

  debug.log("CODEPATH.DEVTOOLS.WATCH-TREEGRID>", "loaded");

  let model = undefined;
  let controller = undefined;
  let selectedNode = undefined;

  return {
    initMvc(gridTableElement) {
      debug.log("CODEPATH.DEVTOOLS.WATCH-TREEGRID>", "initMvc");
      model = CodePath.createWatchModel();
      const view = CodePath.createTreeGridView(gridTableElement, createColumns(), createRows());
      controller = CodePath.createTreeGridController(view, model);
      controller.onNodeSelected(node => {
        selectedNode = node;
      });
      view.onKeyPressed(event => {
        if (selectedNode) {
          //nodeKeyPressHandler(event, selectedNode);
        }
      });
      return () => ({ model, view, controller });
    },
    setContext(context) {
      debug.log("CODEPATH.DEVTOOLS.WATCH-TREEGRID>", "setContext", context);
      model.setContext(context);
    },
    addWatch(expression) {
      debug.log("CODEPATH.DEVTOOLS.WATCH-TREEGRID>", "addWatch", expression);
      model.addWatch(expression);
    },
  };

  // function replaceModel() {
  //   model = CodePath.createWatchModel();
  //   expressions.forEach(expr => model.addWatch(expr));
  //   controller.replaceModel(model);
  // }

  function removeNode(id) {
    model.removeWatchNode(id);
    // const expressionIndex = model.removeWatchNode(id);
    // if (expressionIndex >= 0) {
    //   expressions.splice(expressionIndex, 1);
    // }
  }

  function createColumns() {
    const columns = [
      createLabelColumn(),
      createValueColumn(),
    ];

    return columns;

    function renderDataSpan(text, classNames, child, highlight) {
      const span = document.createElement('span');
      span.classList.add('data');
      if (classNames) {
        span.classList.add(classNames);
      }
      if (highlight) {
        if (highlight.index > 0) {
          span.appendChild(document.createTextNode(text.substr(0, highlight.index)));
        }
        const highlightSpan = document.createElement('span');
        highlightSpan.classList.add('hl');
        highlightSpan.appendChild(document.createTextNode(text.substr(highlight.index, highlight.count)));
        span.appendChild(highlightSpan);
        const highlightEndIndex = highlight.index + highlight.count;
        if (highlightEndIndex < text.length) {
          span.appendChild(document.createTextNode(text.substr(highlightEndIndex)));
        }
      } else {
        span.appendChild(document.createTextNode(text));
      }
      if (child) {
        span.appendChild(child);
      }
      return span;
    }

    function pad(num, size) {
      return (1e15 + num + '').slice(-size); 
    }

    function createLabelColumn() {
      return {
        renderCell(node, controller, rowIndex) {
          const renderRemoveIcon = () => {
            const span = document.createElement('span');
            span.classList.add('remove-icon');
            span.onclick = () => {
              removeNode(node.id);
            };
            return [span];
          };
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
            return [span];
          };
          const renderText = () => {
            return renderDataSpan(
              node.entry.label, 
              undefined, 
              undefined, 
              node.matchHighlight);
          };
          return [
            ...(node.depth === 0 ? renderRemoveIcon() : renderIndents(1)),
            ...renderIndents(node.depth),
            ...(node.firstChild ? renderToggleAnchor() : renderIndents(1)),
            renderText()
          ];
        }
      };
    }

    function createValueColumn() {
      return {
        renderCell(node, controller, trIndex) {
          renderDataSpan(`${node.entry.value}`); 
        }
      };
    }
  }

  function createRows() {
    return { };
  }

});
