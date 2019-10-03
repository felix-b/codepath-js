(function() {

  window.__CODEPATH_INJECTOR__ = (tracer, CodePath, config) => {
    console.log('CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>', 'injecting AppHost logger');
    const codePathHostLogger = createCodePathHostLogger(tracer);
    repluggableAppDebug.host.log = codePathHostLogger;
    //config.configureDevTools(createDevToolsConfiguration());
    console.log('CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>', 'successfully injected AppHost logger');
  }

  if (typeof window.__CODEPATH_INJECTOR_READY__ === 'function') {
    window.__CODEPATH_INJECTOR_READY__();
  }

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

  function createCodePathHostLogger(tracer) {
    return {
      event(severity, id, keyValuePairs, spanFlag) { 
        ensureTagsSerializable(keyValuePairs);
        switch (spanFlag) {
          case 'begin':
            tracer.spanChild(id, keyValuePairs);
            break;
          case 'end':
            tracer.finishSpan();
            break;
          default:
            tracer.logDebug(id, keyValuePairs);
        }
      }
    };
  }

  function ensureTagsSerializable(tags) {
    if (typeof tags.$api === 'string' && Array.isArray(tags.$args)) {
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
