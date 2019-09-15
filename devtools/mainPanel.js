requirejs.config({ });

requirejs(['codepath', 'codePathTreeGrid'], function(CodePath, CodePathTreeGrid) {
  console.info('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'loaded, initializing...');

  const treeGridTable = document.querySelector('#trace-grid');
  const startButton = document.querySelector('#start-button');
  const stopButton = document.querySelector('#stop-button');
  const clearAllButton = document.querySelector('#clear-all-button');
  const entryJsonText = document.querySelector('#entry-json-text');

  const treeGridController = CodePathTreeGrid.initMvc(treeGridTable);
  
  
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
  treeGridController.onNodeSelected((node) => {
    entryJsonText.innerHTML = (node ? `[${node.id}]: ${JSON.stringify(node.entry, null, 2)}` : ''); 
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
});
