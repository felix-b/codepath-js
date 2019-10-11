define(function (require) {
  const CodePath = require('codepath');
  const debug = CodePath.createDebugLog('devtool');

  debug.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "loaded");

  let model = undefined;
  let controller = undefined;
  let searchModel = undefined;
  let selectedNode = undefined;
  let configuration = undefined;

  const timeFormat = new Intl.DateTimeFormat('en-US', { 
    hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' 
  }); 

  return {
    configure(newConfiguration) {
      debug.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "configure", newConfiguration);
      configuration = newConfiguration;
    },
    initMvc(gridTableElement) {
      if (!configuration) {
        console.error("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID> initMvc: not configured");
      }

      debug.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "initMvc");
      model = CodePath.createCodePathModel(configuration.codePathModel);
      const view = CodePath.createTreeGridView(gridTableElement, createColumns(), createRows());
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
        const saveSelectedNode = selectedNode;
        controller.replaceModel(model);
        if (saveSelectedNode) {
          controller.selectNode(saveSelectedNode);
        }
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
      createDurationColumn(),
      createDetailsColumn()
    ];

    return columns;

    function renderDataSpan(text, classNames, child) {
      const span = document.createElement('span');
      span.classList.add('data');
      if (classNames) {
        span.classList.add(classNames);
      }
      const textNode = document.createTextNode(text);
      span.appendChild(textNode);
      if (child) {
        span.appendChild(child);
      }
      return span;
    }

    function pad(num, size) {
      return (1e15 + num + '').slice(-size); 
    }

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
            return renderDataSpan(`${node.entry.messageId}`);
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

    function createDurationColumn() {
      return {
        getTdClass(node, controller, trIndex) {
          return 'align-right';
        },
        renderCell(node, controller, trIndex) {
          if (node.entry.duration) {
            return [renderDataSpan(node.entry.duration.toFixed(3))];
          }
        }
      };
    }

    function createDetailsColumn() {
      return {
        renderCell(node, controller, trIndex) {
          //return [`details...`];
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
