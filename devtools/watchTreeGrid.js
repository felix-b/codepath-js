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
      return controller;
    },
    setContext(context) {

    },
    addWatch(expression) {
      debug.log("CODEPATH.DEVTOOLS.WATCH-TREEGRID>", "receiveEntries", entries);
      model.publish(entries);
    },
  };

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
          const renderRowIcon = () => {
            const span = document.createElement('span');
            span.classList.add('row-icon');
            return span;
          };
          const renderText = () => {
            return renderDataSpan(
              `${node.entry.messageId}`, 
              undefined, 
              undefined, 
              node.matchHighlight);
          };
          return [
            ...renderIndents(node.depth),
            node.firstChild ? renderToggleAnchor() : renderRowIcon(),
            renderText()
          ];
        }
      };
    }

    function createValueColumn() {
      return {
        getTdClass(node, controller, trIndex) {
          if (!node.entry.epoch) {
            return 'align-right';
          }
        },
        renderCell(node, controller, trIndex) {
          if (node.entry.epoch) {
            const decodedTime = new Date(node.entry.epoch);
            return [renderDataSpan(`${timeFormat.format(decodedTime)}.${pad(decodedTime.getMilliseconds(), 3)}`)];
          } else {
            const deltaTime = node.entry.time - node.top.entry.time;
            return [
              renderDataSpan('+', undefined, 
                renderDataSpan(deltaTime.toFixed(3), 'time-offset')
              )
            ];
          }
        }
      };
    }
  }

  function createRows() {
    return {
      getTrClasses(node, rowIndex) {
        const classNames = (node.parent.id !== 0 ? [] : ['root-span']);
        const { metrics } = node;
        if (metrics) {
          if (metrics.error > 0) {
            classNames.push('error');
          } else if (metrics.warning > 0) {
            classNames.push('warning');
          } else if (metrics.event > 0) {
            classNames.push('event');
          }
          if (classNames.length > 0 && node.entry.token === 'Log') {
            classNames.push('root-cause');
          }
        }
        return classNames;
      }
    }
  }

});
