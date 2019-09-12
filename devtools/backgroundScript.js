(function() {

  console.log('CODEPATH.DEVTOOLS.BKG>', 'loading');

  var connections = {};

  chrome.runtime.onConnect.addListener(function (port) {
    var extensionListener = function (message, sender, sendResponse) {
      // The original connection event doesn't include the tab ID of the
      // DevTools page, so we need to send it explicitly.
      if (message.name === 'init') {
        connections[message.tabId] = port;
        console.log('CODEPATH.DEVTOOLS.BKG>', `dev tool page registered for tab ${message.tabId}`);
        return;
      }

      console.error('CODEPATH.DEVTOOLS.BKG>', 'unrecognized message', message);
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
      if (tabId in connections) {
        connections[tabId].postMessage(request);
        console.log('CODEPATH.DEVTOOLS.BKG>', `relaying 1 message to dev tools panel`);
      } else {
        console.error('CODEPATH.DEVTOOLS.BKG>', `tab not found in connection list: ${tabId}`);
      }
    } else {
      console.error('CODEPATH.DEVTOOLS.BKG>', 'sender.tab not defined.');
    }
    return true;
  });

  console.info('CODEPATH.DEVTOOLS.BKG>', 'successfully initialized');

})();
