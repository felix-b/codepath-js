requirejs.config({ });

let backgroundConnection = undefined;

requirejs(['codepath', 'codePathTreeGrid'], function(CodePath, CodePathTreeGrid) {
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
  const filterTextInput = document.querySelector('#filter-text');
  const filterClearButton = document.querySelector('#filter-clear-button');
  const findTextInput = document.querySelector('#find-text');
  const findPrevButton = document.querySelector('#find-prev-button');
  const findNextButton = document.querySelector('#find-next-button');
  const panelResizerDiv = document.querySelector('#panel-resizer');
  const mainPanelDiv = document.querySelector('#panel-main');
  const rightPanelDiv = document.querySelector('#panel-right');

  const configuration = loadConfiguration();
  CodePathTreeGrid.configure(configuration);

  const treeGridController = CodePathTreeGrid.initMvc(treeGridTable);
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
    rightSideElement: document.getElementById('time-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('time-column-resizer-left'),
    leftSideElement: document.getElementById('message-column-header'),
    rightSideElement: document.getElementById('time-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('time-column-resizer-right'),
    leftSideElement: document.getElementById('time-column-header'),
    rightSideElement: document.getElementById('duration-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('duration-column-resizer-left'),
    leftSideElement: document.getElementById('time-column-header'),
    rightSideElement: document.getElementById('duration-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('duration-column-resizer-right'),
    leftSideElement: document.getElementById('duration-column-header'),
    rightSideElement: document.getElementById('details-column-header')
  });
  CodePath.createResizer({
    gripElement: document.getElementById('details-column-resizer-left'),
    leftSideElement: document.getElementById('duration-column-header'),
    rightSideElement: document.getElementById('details-column-header')
  });

  let selectedNode = undefined;
  
  clearAllButton.onclick = () => {
    treeGridController.clearAll();
  };
  startButton.onclick = () => {
    backgroundConnection.postMessage({
      name: 'start',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
    startButton.style.display = 'none';
    stopButton.style.display = 'inline';
    // chrome.tabs.executeScript(
    //   chrome.devtools.inspectedWindow.tabId, 
    //   { 
    //     code: "window.postMessage({type: 'codePath/devTools/startPublish'},'*')"
    //   }, 
    //   function() {
    //     startButton.style.display = 'none';
    //     stopButton.style.display = 'inline';
    //   }
    // );
  };
  stopButton.onclick = () => {
    backgroundConnection.postMessage({
      name: 'stop',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
    stopButton.style.display = 'none';
    startButton.style.display = 'inline';
    // chrome.tabs.executeScript(
    //   chrome.devtools.inspectedWindow.tabId, 
    //   { 
    //     code: "window.postMessage({type: 'codePath/devTools/stopPublish'},'*')"
    //   }, 
    //   function() {
    //     stopButton.style.display = 'none';
    //     startButton.style.display = 'inline';
    //   }
    // );
  };
  filterTextInput.oninput = () => {
    filterTextDebounce.bounce();
  };
  filterClearButton.onclick = () => {
    filterTextInput.value = '';
    applyFilter();
  };
  findNextButton.onclick = () => {
    CodePathTreeGrid.goToNode('', 'next');
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
      case 'codePath/devTools/configure':
        debug.info('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'got configuration message', message.configuration);
        if (message.configuration && message.configuration.treeGrid) {
          CodePathTreeGrid.configure(message.configuration.treeGrid);
        }
        break;
      case 'codePath/devTools/publishEntries':
        CodePathTreeGrid.receiveEntries(message.entries);
        break;
    }
  });

  backgroundConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
  });

  debug.info('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'successfully initialized');

  function applyFilter() {
    CodePathTreeGrid.applyFilter(filterTextInput.value);
  }

  function onNodeSelectedDebounced() {
    entryJsonText.innerHTML = 
      selectedNode 
        ? `[${selectedNode.id}]: ${JSON.stringify(selectedNode.entry, null, 2)}` 
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

});
