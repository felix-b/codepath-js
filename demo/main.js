(function() {

  const createFallbackTracer = () => {
    return {
      spanChild(id, tags) {
        console.log('DEMO > FALLBACK-TRACE(start-span)>', id, tags);
      },
      logDebug(id, tags) {
        console.log('DEMO > FALLBACK-TRACE(log-debug)>', id, tags);
      },
      finishSpan() {
        console.log('DEMO > FALLBACK-TRACE>(finish-span)');
      }
    };
  };

  const init = () => {
    console.log('DEMO> CodePath =', CodePath);

    let tracer = createFallbackTracer();

    window.injectCodePathTracer = (newTracer) => {
      tracer = newTracer;
    };

    console.log('DEMO> injector installed');

    const button1 = document.querySelector('.button-1');
    button1.onclick = (e) => {
      tracer.spanChild('button-1-click', { x: e.clientX, y: e.clientY });
      tracer.logDebug('button-1-clicked');
      tracer.finishSpan();
    };
  };

  const { readyState } = document;
  if (readyState === "complete" || readyState === "loaded" || readyState === "interactive") {
    init(); 
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }

})();


