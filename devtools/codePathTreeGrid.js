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
    initMvc(gridTableElement, nodeKeyPressHandler) {
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
      view.onKeyPressed(event => {
        if (selectedNode && nodeKeyPressHandler) {
          nodeKeyPressHandler(event, selectedNode);
        }
      });
      return controller;
    },
    receiveEntries(entries) {
      debug.log("CODEPATH.DEVTOOLS.CODEPATH-TREEGRID>", "receiveEntries", entries);
      model.publish(entries);
    },
    applyFilter(definition, treeOrFlat) {
      if (searchModel) {
        searchModel.unsubscribeFromSource();
        searchModel = undefined;
      }
      if (definition.include.length > 0 || definition.exclude.length > 0) {
        searchModel = performSearch(definition, treeOrFlat);
        controller.replaceModel(searchModel);
        const firstMatchedNode = searchModel.getFirstMatchedNode();
        controller.selectNode(firstMatchedNode);
      } else {
        const saveSelectedNode = selectedNode;
        controller.replaceModel(model);
        if (saveSelectedNode && saveSelectedNode.sourceNode) {
          controller.selectNode(saveSelectedNode.sourceNode);
        }
      }
    },
    aggregateStats() {
      const rootNode = model.getRootNode();
      const stats = CodePath.aggregateSpanStats(rootNode);
      console.log('STATS>', stats);
      return stats;
    },
    goToNode(text, nextOrPrev) {
      const getNextMatchedNode = () => {
        switch (nextOrPrev) {
          case 'next':
            return selectedNode 
              ? searchModel.getNextMatchedNode(selectedNode)
              : searchModel.getFirstMatchedNode();
          case 'prev':
              return selectedNode 
              ? searchModel.getPrevMatchedNode(selectedNode)
              : searchModel.getFirstMatchedNode();
        }
      }
      
      if (searchModel) {
        const nextNode = getNextMatchedNode() || selectedNode;
        controller.selectNode(nextNode);
      }
    },
  };

  function createSearchPredicate(definition) {
    return (node) => {
      if (!node.entry) {
        return false;
      }
      const messageId = node.entry.messageId;
      if (typeof messageId !== 'string') {
        return false;
      }
      if (node.matchHighlight) {
        node.matchHighlight = undefined;
      }
      for (let iExclude = 0 ; iExclude < definition.exclude.length ; iExclude++) {
        if (messageId.indexOf(definition.exclude[iExclude]) >= 0) {
          return false;
        }
      }
      for (let iInclude = 0 ; iInclude < definition.include.length ; iInclude++) {
        const text = definition.include[iInclude];
        const index = messageId.indexOf(text);
        if (index >= 0) {
          node.matchHighlight = { 
            index, 
            count: text.length 
          };
          return true;
        }
      }
      return false;
    };
  }

  function performSearch(definition, treeOrFlat) {
    const predicate = createSearchPredicate(definition);
    switch (treeOrFlat) {
      case 'tree':
        return CodePath.createCodePathSearchModel(model, predicate);
      case 'flat':
        return CodePath.createCodePathFlatFilterModel(model, predicate);
      default:
        console.error('performSearch: treeOrFlat parameter is missing or invalid');
    }
  }

  function createColumns() {
    const columns = [
      createMessageColumn(),
      createTimeColumn(),
      createDurationColumn(),
      createDetailsColumn()
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
