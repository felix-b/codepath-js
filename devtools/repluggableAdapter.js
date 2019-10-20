// https://skalman.github.io/UglifyJS-online/

(function() {

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

  // function createDevToolsConfiguration() {
  //   return {
  //     rows: {
  //       error: { 
  //         tag: '$level',
  //         value: 'error'
  //       },
  //       warning: { },
  //       info: { },
  //     },
  //     columns: [

  //     ]
  //   };
  // }

  function createCodePathHostLogger(codePathObject, CodePathLib) {
    return {
      log(severity, id, keyValuePairs) { 
        if (codePathObject.getActiveSpan()) {
          ensureTagsSerializable(keyValuePairs);
          codePathObject.logDebug(id, keyValuePairs);
        }
      },
      spanRoot(id, keyValuePairs) {
        ensureTagsSerializable(keyValuePairs);
        const tracerSpan = codePathObject.spanRoot(id, keyValuePairs);
        return createShellLoggerSpan(tracerSpan);
      },
      spanChild(id, keyValuePairs) {
        if (codePathObject.getActiveSpan()) {
          ensureTagsSerializable(keyValuePairs);
          const tracerSpan = codePathObject.spanChild(id, keyValuePairs);
          return createShellLoggerSpan(tracerSpan);
        } else {
          return noopSpan;
        }
      },
    };

    function createShellLoggerSpan(tracerSpan) {
      return {
        end(success, error, keyValuePairs) {
          // if (keyValuePairs) {
          //   tracerSpan.addTags(keyValuePairs);
          // }
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

  function ensureTagsSerializable(tags) {
    if (typeof tags === 'object' && typeof tags.$api === 'string' && Array.isArray(tags.$args)) {
      let anyNonSerializableArgs = false;
      for (let i = 0 ; i < tags.$args.length ; i++) {
        const argValue = tags.$args[i];
        const argType = typeof argValue;
        if (argType === 'function' || (argType === 'object' && argValue !== null)) {
          anyNonSerializableArgs = true;
          break;
        }
      }
      if (anyNonSerializableArgs) {
        tags.$meta = {
          stringify: ['$args']
        };
      }
    }
  }

})();
