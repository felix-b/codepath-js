(function() {
  let entryStream = undefined;
  let publishIntervalId = undefined;

  window.addEventListener('message', (event) => {
    if (typeof event.data === 'object' && 
      event.data.type === 'codePath/devTools/codePathLibUrl' &&
      typeof event.data.url === 'string') 
    {
      console.log('CODEPATH.DEVTOOLS.PAGE>', 'loading CodePath from URL:', event.data.url);
      beginLoadCodePathLib(event.data.url);
    }
  });
  
  window.postMessage({
    type: 'codePath/devTools/queryCodePathLibUrl'
  }, '*');

  function beginLoadCodePathLib(url) {
    const urlWithoutJsExtension = url.slice(0, -3);
    requirejs.config({ 
      paths: { 
        'CodePath': urlWithoutJsExtension 
      } 
    });
    require(['CodePath'], runWithCodePathLib);
  }

  function runWithCodePathLib(codePathLib) {
    console.log('CODEPATH.DEVTOOLS.PAGE>', 'CodePath loaded', codePathLib);
    window.CodePath = codePathLib;

    const CodePath = codePathLib;
    const debug = CodePath.debugLog;

    window.addEventListener('message', (event) => {
      if (typeof event.data === 'object' && typeof event.data.type === 'string') {
        switch (event.data.type) {
          case 'codePath/devTools/startPublish':
            startPublish();
            break;          
          case 'codePath/devTools/stopPublish':
            stopPublish();
            break;
        }
      }
    });
  
    attemptInstall();

    function attemptInstall() {
      const injector = window.__CODEPATH_INJECTOR__;

      if (typeof injector === "function") {
        installCodePathOnPage(injector);
      } else {
        debug.warn('CODEPATH.DEVTOOLS.PAGE>', 'injector not ready; installing on-ready notification');
        window.__CODEPATH_INJECTOR_READY__ = attemptInstall;

        const adapterScript = localStorage.getItem('codePath.devTools.adapterScript');
        if (adapterScript) {
          eval(adapterScript);
        }
      }
    }

    function installCodePathOnPage(injector) {
      if (typeof CodePath !== "object") {
        debug.error('CODEPATH.DEVTOOLS.PAGE>', 'codepath library not loaded; page ignored', CodePath);
        return;
      }
    
      const { input, output } = CodePath.createCodePath({ 
        stream: { 
          enabled: false 
        }
      });

      injector(input, CodePath);
      entryStream = output;

      debug.info('CODEPATH.DEVTOOLS.PAGE>', 'successfully installed');
    }

    function publishEntries() {
      if (entryStream.peekEntries().length > 0) {
        const entries = entryStream.takeEntries();
        window.postMessage({
          type: 'codePath/devTools/publishEntries',
          entries
        }, '*');
      }
    }

    function startPublish() {
      if (publishIntervalId) {
        return;
      }

      publishIntervalId = setInterval(() => publishEntries(), 250);
      entryStream.enable();

      debug.info('CODEPATH.DEVTOOLS.PAGE>', 'publish started');
    }

    function stopPublish() {
      if (!publishIntervalId) {
        return;
      }
      
      clearInterval(publishIntervalId);
      publishIntervalId = undefined;

      entryStream.enable(false);
      entryStream.takeEntries();

      debug.info('CODEPATH.DEVTOOLS.PAGE>', 'publish stopped');
    }
  }
})();
