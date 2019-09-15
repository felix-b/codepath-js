requirejs.config({ });

requirejs(['codepath', 'codePathTreeGrid'], function(CodePath, CodePathTreeGrid) {
  console.info('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'loaded, initializing...');

  const tableElement = document.querySelector('#trace-grid');
  const treeGridController = CodePathTreeGrid.initMvc(tableElement);

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
