// https://skalman.github.io/UglifyJS-online/

(function() {

  console.log('---CODE PATH REPLUGGABLE ADAPTER---');

  if (window.__CODEPATH_INJECTOR__) {
    console.log('duplicate invocation on this page!!');
    return;
  }

  console.log('use stack trace below to go to source:');
  console.log((new Error()).stack);

  window.__CODEPATH_INJECTOR__ = (CodePathLib, codePathObject) => {
    console.log('CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>', 'injecting AppHost logger');
    const codePathHostLogger = createCodePathHostLogger(codePathObject, CodePathLib);
    repluggableAppDebug.host.log = codePathHostLogger;
    //config.configureDevTools(createDevToolsConfiguration());
    console.log('CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>', 'successfully injected AppHost logger');
  };

  if (typeof window.__CODEPATH_INJECTOR_READY__ === 'function') {
    window.__CODEPATH_INJECTOR_READY__();
  }

  const noopSpan = {
    end() {}
  };

  function createCodePathHostLogger(codePathObject, CodePathLib) {
    return {
      log(severity, id, keyValuePairs) { 
        if (codePathObject.getActiveSpan()) {
          codePathObject.logDebug(id, keyValuePairs);
        }
      },
      spanRoot(id, keyValuePairs) {
        const tracerSpan = codePathObject.spanRoot(id, keyValuePairs);
        return createShellLoggerSpan(tracerSpan, CodePathLib);
      },
      spanChild(id, keyValuePairs) {
        if (codePathObject.getActiveSpan()) {
          const tracerSpan = codePathObject.spanChild(id, keyValuePairs);
          return createShellLoggerSpan(tracerSpan, CodePathLib);
        } else {
          return noopSpan;
        }
      },
    };

    function createShellLoggerSpan(tracerSpan, CodePathLib) {
      return {
        end(success, error, keyValuePairs) {
          if (keyValuePairs) {
            keyValuePairs.$retVal = keyValuePairs.returnValue;
            delete keyValuePairs.returnValue;
            tracerSpan.addTags(keyValuePairs);
          }
          if (error) {
            tracerSpan.log({
              $id: 'OperationFailure', 
              level: CodePathLib.LOG_LEVEL.error
            });
          }
          tracerSpan.finish();
          codePathObject.notifySpanFinished(tracerSpan);
        }
      }
    }
  }

})();
