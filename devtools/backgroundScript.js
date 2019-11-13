(function() {
  const debug = CodePath.createDebugLog('background');

  debug.log('CODEPATH.DEVTOOLS.BKG>', 'loading');

  var connections = {};
  var initMessageFromPageByTabId = {};
  
  chrome.runtime.onConnect.addListener(function (port) {
    var extensionListener = function (message, sender, sendResponse) {
      if (typeof message.tabId === 'number' && typeof message.name === 'string') {
        switch (message.name) {
          case 'init': 
            connections[message.tabId] = port;
            debug.log('CODEPATH.DEVTOOLS.BKG>', `dev tool page registered for tab ${message.tabId}`);
            const initMessage = initMessageFromPageByTabId[message.tabId];
            if (initMessage) {
              debug.log('CODEPATH.DEVTOOLS.BKG>', `replaying init message from page [tab=${message.tabId}]`, initMessage);
              port.postMessage(initMessage);
            }
            break;
          case 'runPageAdapterScript':
            chrome.tabs.sendMessage(
              message.tabId, 
              { 
                type: 'codePath/devTools/runPageAdapterScript',
                script: message.script,
              }
            );
            break;
          case 'start':
            chrome.tabs.executeScript(
              message.tabId, 
              { 
                code: "window.postMessage({type: 'codePath/devTools/startPublish'},'*')"
              }
            );
            break;
          case 'stop': 
            chrome.tabs.executeScript(
              message.tabId, 
              { 
                code: "window.postMessage({type: 'codePath/devTools/stopPublish'},'*')"
              }
            );
            break;
          case 'replayApiCall':
            chrome.tabs.sendMessage(
              message.tabId, 
              { 
                type: 'codePath/devTools/replayApiCall',
                apiCall: message.apiCall,
                prepareOnly: message.prepareOnly
              }
            );
            break;
          case 'fetchTags': 
            chrome.tabs.executeScript(
              message.tabId, 
              { 
                code: `window.postMessage({type: 'codePath/devTools/fetchTagsRequest', tagsIds: [${message.tagsIds.join(',')}]},'*')`
              }
            );
            break;
          case 'clearAll': 
            chrome.tabs.executeScript(
              message.tabId, 
              { 
                code: "window.postMessage({type: 'codePath/devTools/clearAll'},'*')"
              }
            );
            break;
          default:
            debug.warn('CODEPATH.DEVTOOLS.BKG>', 'unrecognized message', message);
        }
      }
      // The original connection event doesn't include the tab ID of the
      // DevTools page, so we need to send it explicitly.
      // if (message.name === 'init') {
      //   return;
      // }
      // else if (message.name === 'start' || message.name === 'stop') {

      // }

    }

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function(port) {
      port.onMessage.removeListener(extensionListener);

      var tabs = Object.keys(connections);
      for (var i=0, len=tabs.length; i < len; i++) {
        if (connections[tabs[i]] == port) {
          delete connections[tabs[i]];
          break;
        }
      }
    });
  });

  // Receive message from content script and relay to the devTools page for the
  // current tab
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Messages from content scripts should have sender.tab set
    if (sender.tab) {
      var tabId = sender.tab.id;
      if (request.isInitMessage === true) {
        debug.log('CODEPATH.DEVTOOLS.BKG>', `storing init message from page for tab ${tabId}`, request);
        initMessageFromPageByTabId[tabId] = request;
      }
      if (tabId in connections) {
        connections[tabId].postMessage(request);
        debug.log('CODEPATH.DEVTOOLS.BKG>', `relaying 1 message to dev tools panel`);
      } else {
        debug.warn('CODEPATH.DEVTOOLS.BKG>', `tab not found in connection list: ${tabId}`);
      }
    } else {
      debug.warn('CODEPATH.DEVTOOLS.BKG>', 'sender.tab not defined.');
    }
    return true;
  });

  debug.info('CODEPATH.DEVTOOLS.BKG>', 'successfully initialized');

})();
