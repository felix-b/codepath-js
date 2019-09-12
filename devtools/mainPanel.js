(function() {

  console.log('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'loading');

  const renderEntry = (entry) => {
    const div = document.createElement('div');
    div.innerHTML = `${entry.time}:${entry.token}:${entry.messageId || ''}`;
    return div;
  };

  const receiveEntries = (entries) => {
    for (element of entries.map(renderEntry)) {
      document.body.appendChild(element);
    }
  }

  const backgroundConnection = chrome.runtime.connect({
    name: 'codePathMainPanel'
  });

  backgroundConnection.onMessage.addListener(function(message) {
    if (typeof message === 'object' && 
      message.type === 'codePath/devTools/publishEntries' &&
      Array.isArray(message.entries)) 
    {
      receiveEntries(message.entries);
    }
  });

  backgroundConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
  });

  console.info('CODEPATH.DEVTOOLS.MAIN-PANEL>', 'successfully initialized');

})();
