requirejs.config({ });

let backgroundConnection = undefined;

requirejs(['codepath', 'codePathTreeGrid', 'objectAssignDeep'], function(CodePath, CodePathTreeGrid, objectAssignDeep) {
  backgroundConnection = chrome.runtime.connect({
    name: 'codePathMainPanel'
  });

  const debug = CodePath.createDebugLog('devtool', { backgroundConnection });
  debug.info('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'loaded, initializing...');

  const treeGridTable = document.querySelector('#trace-grid');
  const startButton = document.querySelector('#start-button');
  const stopButton = document.querySelector('#stop-button');
  const clearAllButton = document.querySelector('#clear-all-button');
  const entryJsonText = document.querySelector('#entry-json-text');
  const filterIncludeText1 = document.querySelector('#filter-text');
  const filterIncludeText2 = document.querySelector('#filter-text-2');
  const filterIncludeText3 = document.querySelector('#filter-text-3');
  const filterExcludeText1 = document.querySelector('#filter-exclude-text-1');
  const filterExcludeText2 = document.querySelector('#filter-exclude-text-2');
  const filterExcludeText3 = document.querySelector('#filter-exclude-text-3');
  const filterClearButton = document.querySelector('#filter-clear-button');
  const filterFlatCheckbox = document.querySelector('#filter-flat-check');
  const findTextInput = document.querySelector('#find-text');
  const findPrevButton = document.querySelector('#find-prev-button');
  const findNextButton = document.querySelector('#find-next-button');
  const panelResizerDiv = document.querySelector('#panel-resizer');
  const mainPanelDiv = document.querySelector('#panel-main');
  const rightPanelDiv = document.querySelector('#panel-right');
  const allFilterTextInputs = [
    filterIncludeText1, 
    filterIncludeText2, 
    filterIncludeText3, 
    filterExcludeText1, 
    filterExcludeText2, 
    filterExcludeText3
  ];

  const configuration = loadConfiguration();
  CodePathTreeGrid.configure(configuration);

  const treeGridController = CodePathTreeGrid.initMvc(treeGridTable, handleKeyPressEvent);
  const filterTextDebounce = CodePath.createDebounce(applyFilter, 500);
  const nodeSelectedDebounce = CodePath.createDebounce(onNodeSelectedDebounced, 100);
  
  CodePath.createResizer({
    gripElement: panelResizerDiv,
    leftSideElement: mainPanelDiv,
    rightSideElement: rightPanelDiv
  });
  CodePath.createResizer({
    gripElement: document.getElementById('message-column-resizer-right'),
    leftSideElement: document.getElementById('message-column-header'),
    rightSideElement: undefined//document.getElementById('time-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('time-column-resizer-left'),
    leftSideElement: document.getElementById('message-column-header'),
    rightSideElement: undefined//document.getElementById('time-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('time-column-resizer-right'),
    leftSideElement: document.getElementById('time-column-header'),
    rightSideElement: undefined//document.getElementById('duration-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('duration-column-resizer-left'),
    leftSideElement: document.getElementById('time-column-header'),
    rightSideElement: undefined//document.getElementById('duration-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('duration-column-resizer-right'),
    leftSideElement: document.getElementById('duration-column-header'),
    rightSideElement: undefined//document.getElementById('details-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('details-column-resizer-left'),
    leftSideElement: document.getElementById('duration-column-header'),
    rightSideElement: undefined//document.getElementById('details-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('details-column-resizer-right'),
    leftSideElement: document.getElementById('details-column-header'),
    rightSideElement: undefined//document.getElementById('details-column-header')
  });

  let selectedNode = undefined;
  let nodesTagsByTagsIds = {};
  
  clearAllButton.onclick = (e) => {
    treeGridController.clearAll();
    backgroundConnection.postMessage({
      name: 'clearAll',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
    nodesTagsByTagsIds = {};
    selectedNode = undefined;
    onNodeSelectedDebounced();
  };
  startButton.onclick = (e) => {
    backgroundConnection.postMessage({
      name: 'start',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
    startButton.style.display = 'none';
    stopButton.style.display = 'inline';
  };
  const executeStopCommand = () => {
    backgroundConnection.postMessage({
      name: 'stop',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
    stopButton.style.display = 'none';
    startButton.style.display = 'inline';
  };
  stopButton.onclick = executeStopCommand;
  allFilterTextInputs.forEach(el => el.oninput = () => {
    filterTextDebounce.bounce();
  });
  filterFlatCheckbox.onclick = (e) => {
    applyFilter();
  };
  filterClearButton.onclick = (e) => {
    allFilterTextInputs.forEach(el => el.value = '');
    applyFilter();
  };
  findNextButton.onclick = (e) => {
    CodePathTreeGrid.goToNode('', 'next');
  };
  findPrevButton.onclick = (e) => {
    CodePathTreeGrid.goToNode('', 'prev');
  };
  treeGridController.onNodeSelected((node) => {
    selectedNode = node;
    nodeSelectedDebounce.bounce();
  });

  backgroundConnection.onMessage.addListener(function(message) {
    if (typeof message !== 'object' || typeof message.type !== 'string') {
      return;
    }

    switch (message.type) {
      case 'codePath/devTools/requestRunAdapterOnPage':
        debug.info('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'got adapter run request');
        backgroundConnection.postMessage({
          name: 'runPageAdapterScript',
          tabId: chrome.devtools.inspectedWindow.tabId,
          script: configuration.pageInit,
        });
        executeStopCommand();
        break;
      case 'codePath/devTools/publishEntries':
        CodePathTreeGrid.receiveEntries(message.entries);
        break;
      case 'codePath/devTools/fetchTagsReply':
        const { tagsById } = message;
        for (let tagId in tagsById) {
          nodesTagsByTagsIds[tagId] = tagsById[tagId];
        }
        onNodeSelectedDebounced();
        break;
    }
  });

  backgroundConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
  });

  debug.info('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'successfully initialized');

  function applyFilter() {
    const filterText = filterIncludeText1.value;
    const isFlatChecked = filterFlatCheckbox.checked;
    const filterDefinition = {
      include: [
        filterIncludeText1.value.trim(),
        filterIncludeText2.value.trim(),
        filterIncludeText3.value.trim(),
      ].filter(s => s.length > 0),
      exclude: [
        filterExcludeText1.value.trim(),
        filterExcludeText2.value.trim(),
        filterExcludeText3.value.trim(),
      ].filter(s => s.length > 0)
    }
    CodePathTreeGrid.applyFilter(filterDefinition, isFlatChecked ? 'flat' : 'tree');
  }

  function onNodeSelectedDebounced() {

    const deserializeTags = (tags) => {
      if (tags.$meta && tags.$meta.stringify) {
        if (tags.$meta.deserialized === true) {
          return;
        }
        for (let i = 0 ; i < tags.$meta.stringify.length ; i++) {
          const id = tags.$meta.stringify[i];
          try {
            tags[id] = JSON.parse(tags[id]);
          } catch(err) {
            if (!tags.$meta.errors) {
              tags.$meta.errors = {};
            }
            tags.$meta.errors[id] = err.message;
          }
        }
        tags.$meta.deserialized = true;
      }
    };

    const buildTagsObject = (tagsIds) => {
      const tagsObjects = tagsIds
        .map(id => nodesTagsByTagsIds[id])
        .filter(tagsObj => !!tagsObj);
      let result = objectAssignDeep({}, tagsObjects);
      deserializeTags(result);
      return result;
    };

    const buildDetailsObject = () => {
      const tagsIds = getNormalizedTagsIds(selectedNode.entry);
      const missingTagsIds = tagsIds.filter(id => !nodesTagsByTagsIds[id]);
      if (missingTagsIds.length > 0) {
        requestStrippedTags(missingTagsIds);
        return undefined;
      }
      const details = {
        tags: buildTagsObject(tagsIds),
        metrics: selectedNode.metrics,
        entry: selectedNode.entry,
        parentNodeId: selectedNode.parent.id,
      };
      return details;
    };

    const detailsObject = selectedNode
      ? buildDetailsObject()
      : undefined;

    entryJsonText.innerHTML = 
      detailsObject 
        ? `[${selectedNode.id}]: ${JSON.stringify(detailsObject, null, 2)}` 
        : ''; 
  }

  function loadConfiguration() {
    const configScript = localStorage.getItem('codePath/devTools/configScript');
    console.log('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'loaded config script', configScript);

    if (configScript) {
      const configFunc = new Function('codePathLib', configScript);
      const configuration = configFunc(CodePath);
      console.log('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'evaluated configuration', configuration);
      return configuration;
    }

    console.warn('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'config script not found, using defaults');
  }

  function handleKeyPressEvent(event, node) {
    switch (event.key) {
      case "Enter":
        const prepareOnly = event.shiftKey;
        requestReplayCall(node.entry, prepareOnly);
        event.preventDefault();
        break;
    }
  }

  function getNormalizedTagsIds(entry) {
    return typeof entry.tags.$$id === 'number' 
      ? [entry.tags.$$id] 
      : entry.tags.$$id;
  }

  function requestStrippedTags(tagsIds) {
    backgroundConnection.postMessage({
      name: 'fetchTags',
      tabId: chrome.devtools.inspectedWindow.tabId,
      tagsIds
    });
  }

  function requestReplayCall(entry, prepareOnly) {
    const { $api, $apiFunc, $args } = entry.tags;
    if (typeof $api !== 'string' || typeof $apiFunc !== 'string') {
      return;
    }

    const callArgs = (
      typeof $args === 'string'
      ? JSON.parse($args)
      : $args);

    const apiCall = {
      api: $api,
      apiFunc: $apiFunc,
      apiArgs: callArgs
    };
    
    backgroundConnection.postMessage({
      name: 'replayApiCall',
      tabId: chrome.devtools.inspectedWindow.tabId,
      apiCall,
      prepareOnly
    });
  }

});
