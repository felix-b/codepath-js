(function() {
  const debug = CodePath.createDebugLog('content');

  if (window !== window.top) {
    return;
  }

  debug.log('CODEPATH.DEVTOOLS.CONTENT>', 'loading');

  const injectScript = (file, node, onLoad) => {
    var parent = document.getElementsByTagName(node)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    parent.appendChild(script);
    if (onLoad) {
      script.onload = onLoad;
    }
    script.setAttribute('src', file);
  } 

  const relayMessageToBackground = (message) => {
    debug.log('CODEPATH.DEVTOOLS.CONTENT>', `relaying 1 message to background`, message);
    chrome.runtime.sendMessage(message);
  }

  window.addEventListener('message', (event) => {
    if (typeof event.data === 'object' && typeof event.data.type === 'string') {
      if (event.data.type === 'codePath/devTools/publishEntries' && Array.isArray(event.data.entries))  {
        relayMessageToBackground(event.data);
        return;
      } 
      if (event.data.type === 'codePath/devTools/queryCodePathLibUrl') {
        const url = chrome.extension.getURL('/codepath.js');
        window.postMessage({
          type: 'codePath/devTools/codePathLibUrl',
          url
        }, '*');
        return;
      }
    }
    
    debug.log('CODEPATH.DEVTOOLS.CONTENT>', 'unexpected message, ignored', event.data);
  });
  
  injectScript(chrome.extension.getURL('/pageScript.js'), 'body');

  // const h1 = document.createElement('h1');
  // h1.innerHTML = 'HELLO FROM CODEPATH DEV TOOLS!';
  // document.body.appendChild(h1);

  // const injector = window.injectCodePathTracer;

  // if (typeof injector !== 'function') {
  //   debug.log('CODEPATH DEVTOOLS>', 'injector not found', injector);
  //   return;
  // }

  // if (typeof CodePath !== 'object') {
  //   debug.log('CODEPATH DEVTOOLS>', 'codepath library not loaded');
  //   return;
  // }

  // const { input, output } = CodePath.createCodePath();

  // injector(input);

  // setInterval(() => {
  //   if (output.peekEntries().length > 0) {
  //     const entries = output.takeEntries();
  //     debug.log('CODEPATH DEVTOOLS > OUTPUT>', entries);
  //   }
  // }, 1000);

  // debug.log('CODEPATH DEVTOOLS>', 'successfully initialized');

  debug.info('CODEPATH.DEVTOOLS.CONTENT>', 'successfully initialized');

})();
