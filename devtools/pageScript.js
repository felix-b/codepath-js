(function() {
  let entryStream = undefined;
  let publishIntervalId = undefined;

  window.addEventListener('message', (event) => {
    if (typeof event.data === 'object' && typeof event.data.type === 'string') {
      switch (event.data.type) {
        case 'codePath/devTools/codePathLibUrl':
          console.log('CODEPATH.DEVTOOLS.PAGE>', 'loading CodePath from URL:', event.data.url);
          beginLoadCodePathLib(event.data.url);
          break;
        case 'codePath/devTools/runPageAdapterScript':
          console.log('CODEPATH.DEVTOOLS.PAGE>', 'running page adapter script', event.data.script);
          eval(event.data.script);
          break;
      }
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
    const debug = CodePath.createDebugLog('page');

    window.addEventListener('message', (event) => {
      if (typeof event.data === 'object' && typeof event.data.type === 'string') {
        switch (event.data.type) {
          case 'codePath/devTools/startPublish':
            startPublish();
            break;          
          case 'codePath/devTools/stopPublish':
            stopPublish();
            break;
          case 'codePath/devTools/replayApiCall':
            prepareReplayApiCall(event.data.apiCall, event.data.prepareOnly);
            break;
          case 'codePath/devTools/printTable':
            printTable(event.data.title, event.data.table);
            break;
        }
      }
    });
  
    requestRunAdapterOnPage();
    attemptInstall();

    function attemptInstall() {
      const injector = window.__CODEPATH_INJECTOR__;

      if (typeof injector === "function") {
        installCodePathOnPage(injector);
      } else {
        debug.warn('CODEPATH.DEVTOOLS.PAGE>', 'injector not ready; installing on-ready notification');
        window.__CODEPATH_INJECTOR_READY__ = attemptInstall;

        // const adapterScript = localStorage.getItem('codePath.devTools.adapterScript');
        // if (adapterScript) {
        //   eval(adapterScript);
        // }
      }
    }

    function installCodePathOnPage(injector) {
      if (typeof CodePath !== "object") {
        debug.error('CODEPATH.DEVTOOLS.PAGE>', 'codepath library not loaded; page ignored', CodePath);
        return;
      }
    
      const { input, output } = CodePath.createCodePath({ 
        stream: { 
          enabled: false,
          stripTags: true
        }
      });

      window.addEventListener('message', (event) => {
        if (typeof event.data === 'object' && typeof event.data.type === 'string') {
          switch (event.data.type) {
            case 'codePath/devTools/clearAll':
              input.clearAll();
              output.clearAll();
              break;
            case 'codePath/devTools/fetchTagsRequest':
              const tagsById = output.getStrippedTags(event.data.tagsIds);
              window.postMessage({
                type: 'codePath/devTools/fetchTagsReply',
                tagsById  
              }, '*');
              break;
          }
        }
      });
  
      injector(CodePath, input);
      entryStream = output;

      debug.info('CODEPATH.DEVTOOLS.PAGE>', 'successfully installed');
    }

    function requestRunAdapterOnPage() {
      window.postMessage({
        type: 'codePath/devTools/requestRunAdapterOnPage',
        isInitMessage: true
      }, '*');
    }

    function publishEntries() {
      if (entryStream.peekEntries().length > 0) {
        const entries = entryStream.takeEntries();
        try {
          window.postMessage({
            type: 'codePath/devTools/publishEntries',
            entries
          }, '*');
        } catch(err) {
          console.error('FAILED TO PUBLISH ENTRIES', entries);
        }
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

    function prepareReplayApiCall(apiCall, prepareOnly) {
      const { api, apiFunc, apiArgs } = apiCall;
      console.log(`--- REPLAY API CALL: ${api}.${apiFunc} ---`);
      for (let i = 0 ; i < apiArgs.length ; i++) {
        const varName = `apiArg${i + 1}`;
        window[varName] = apiArgs[i];
        console.log(varName, apiArgs[i]);
      }
      const callExpression = `apis.${api}.${apiFunc}(${apiArgs.map((value, index) => `apiArg${index + 1}`).join(',')})`;
      console.log(callExpression);
      if (!prepareOnly) {
        console.log('--- executing ---');
        console.log(eval(callExpression));
      }
    }

    function printTable(title, data) {
      console.log(title);
      console.table(data);
    }
  }
})();
