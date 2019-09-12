(function() {

  if (window !== window.top) {
    return;
  }

  console.log('CODEPATH.DEVTOOLS.CONTENT>', 'loading');

  const injectScript = (file, node) => {
    var parent = document.getElementsByTagName(node)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file);
    parent.appendChild(script);
  } 

  const relayMessageToBackground = (message) => {
    console.log('CODEPATH.DEVTOOLS.CONTENT>', `relaying 1 message to background`, message);
    chrome.runtime.sendMessage(message);
  }

  window.addEventListener('message', (event) => {
    if (typeof event.data === 'object' && 
      event.data.type === 'codePath/devTools/publishEntries' &&
      Array.isArray(event.data.entries)) 
    {
      relayMessageToBackground(event.data);
    } else {
      console.log('CODEPATH.DEVTOOLS.CONTENT>', 'unexpected message, ignored', event.data);
    }
  });
  
  injectScript(chrome.extension.getURL('/pageScript.js'), 'body');

  // const h1 = document.createElement('h1');
  // h1.innerHTML = 'HELLO FROM CODEPATH DEV TOOLS!';
  // document.body.appendChild(h1);

  // const injector = window.injectCodePathTracer;

  // if (typeof injector !== 'function') {
  //   console.log('CODEPATH DEVTOOLS>', 'injector not found', injector);
  //   return;
  // }

  // if (typeof CodePath !== 'object') {
  //   console.log('CODEPATH DEVTOOLS>', 'codepath library not loaded');
  //   return;
  // }

  // const { input, output } = CodePath.createCodePath();

  // injector(input);

  // setInterval(() => {
  //   if (output.peekEntries().length > 0) {
  //     const entries = output.takeEntries();
  //     console.log('CODEPATH DEVTOOLS > OUTPUT>', entries);
  //   }
  // }, 1000);

  // console.log('CODEPATH DEVTOOLS>', 'successfully initialized');

  console.info('CODEPATH.DEVTOOLS.CONTENT>', 'successfully initialized');

})();
