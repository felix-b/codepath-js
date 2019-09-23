requirejs.config({ });

requirejs(['codepath', 'codePathTreeGrid'], function(CodePath, CodePathTreeGrid) {
  console.info('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'loaded, initializing...');

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

  const treeGridController = CodePathTreeGrid.initMvc(treeGridTable);
  const filterTextDebounce = CodePath.createDebounce(applyFilter, 500);
  const nodeSelectedDebounce = CodePath.createDebounce(onNodeSelectedDebounced, 100);
    
  let selectedNode = undefined;
  
  clearAllButton.onclick = () => {
    treeGridController.clearAll();
  };
  startButton.onclick = () => {
    chrome.tabs.executeScript(
      chrome.devtools.inspectedWindow.tabId, 
      { 
        code: "window.postMessage({type: 'codePath/devTools/startPublish'},'*')"
      }, 
      function() {
        startButton.style.display = 'none';
        stopButton.style.display = 'inline';
      }
    );
  };
  stopButton.onclick = () => {
    chrome.tabs.executeScript(
      chrome.devtools.inspectedWindow.tabId, 
      { 
        code: "window.postMessage({type: 'codePath/devTools/stopPublish'},'*')"
      }, 
      function() {
        stopButton.style.display = 'none';
        startButton.style.display = 'inline';
      }
    );
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

  const backgroundConnection = chrome.runtime.connect({
    name: 'codePathMainPanel'
  });

  backgroundConnection.onMessage.addListener(function(message) {
    if (typeof message === 'object' && 
      message.type === 'codePath/devTools/publishEntries' &&
      Array.isArray(message.entries)) 
    {
      CodePathTreeGrid.receiveEntries(message.entries);
    }
  });

  backgroundConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
  });

  console.info('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'successfully initialized');

  function applyFilter() {
    CodePathTreeGrid.applyFilter(filterTextInput.value);
  }

  function onNodeSelectedDebounced() {
    entryJsonText.innerHTML = 
      selectedNode 
        ? `[${selectedNode.id}]: ${JSON.stringify(selectedNode.entry, null, 2)}` 
        : ''; 
  }

});
