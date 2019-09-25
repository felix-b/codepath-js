(function() {
  // const h1 = document.createElement("h1");
  // h1.innerHTML = "HELLO FROM CODEPATH DEV TOOLS PAGESCRIPT!";
  // document.body.appendChild(h1);

  let entryStream = undefined;
  let publishIntervalId = undefined;

  attemptInstall();

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

  function attemptInstall() {
    const injector = window.__CODEPATH_INJECTOR__;

    if (typeof injector === "function") {
      installCodePathOnPage(injector);
    } else {
      console.warn('CODEPATH.DEVTOOLS.PAGE>', 'injector not ready; installing on-ready notification');
      window.__CODEPATH_INJECTOR_READY__ = attemptInstall;

      const adapterScript = localStorage.getItem('codePath.devTools.adapterScript');
      if (adapterScript) {
        eval(adapterScript);
      }
    }
  }

  function installCodePathOnPage(injector) {
    if (typeof CodePath !== "object") {
      console.error('CODEPATH.DEVTOOLS.PAGE>', 'codepath library not loaded; page ignored', CodePath);
      return;
    }
  
    const { input, output } = CodePath.createCodePath({ 
      stream: { 
        enabled: false 
      }
    });

    injector(input);
    entryStream = output;

    console.info('CODEPATH.DEVTOOLS.PAGE>', 'successfully installed');
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

    console.info('CODEPATH.DEVTOOLS.PAGE>', 'publish started');
  }

  function stopPublish() {
    if (!publishIntervalId) {
      return;
    }
    
    clearInterval(publishIntervalId);
    publishIntervalId = undefined;

    entryStream.enable(false);
    entryStream.takeEntries();

    console.info('CODEPATH.DEVTOOLS.PAGE>', 'publish stopped');
  }
})();
