(function() {

  window.addEventListener('message', (event) => {
    if (typeof event.data === 'object' && 
      event.data.type === 'codePath/devTools/codePathLibUrl' && 
      typeof event.data.url === 'string') 
    {
      console.log('CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>', 'got CodePath lib URL', event.data.url);
      beginLoadCodePathLib(event.data.url);
    }
    console.log('CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>', 'unexpected message, ignored', event);
  }, true);

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
    require(['CodePath'], initializeWithCodePathLib);
  }

  function initializeWithCodePathLib(lib) {
    console.log('CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>', 'CodePath loaded', lib);
    window.CodePath = lib;

    window.__CODEPATH_INJECTOR__ = (tracer) => {
      const codePathHostLogger = createCodePathHostLogger(tracer);
      repluggableAppDebug.host.log = codePathHostLogger;
    }

    if (typeof window.__CODEPATH_INJECTOR_READY__ === 'function') {
      window.__CODEPATH_INJECTOR_READY__();
    }
  }

  function createCodePathHostLogger(tracer) {
    return {
      event(severity, id, keyValuePairs, spanFlag) { 
        const serializableKeyValuePairs = makeSerializable(keyValuePairs);
        switch (spanFlag) {
          case 'begin':
            tracer.spanChild(id, serializableKeyValuePairs);
            break;
          case 'end':
            tracer.finishSpan();
            break;
          default:
            tracer.logDebug(id, serializableKeyValuePairs);
        }
      }
    };
  }

  function makeSerializable(data) {
    if (typeof data.$api !== 'string' || !Array.isArray(data.$args)) {
      return data;
    }

    return {
      ...data,
      $args: data.$args.map(arg => {
        if (typeof arg === 'object' || typeof arg === 'function') {
          return '...';
        }
        return arg;
      })
    };
  }

})();
