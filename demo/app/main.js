define(function (require) {
  const CodePath = require('build/index');
  const trace = CodePath.trace;

  const createFallbackTracer = () => {
    return {
      spanChild(id, tags) {
        console.log('DEMO > FALLBACK-TRACE(span-child)>', id, tags);
      },
      spanRoot(id, tags) {
        console.log('DEMO > FALLBACK-TRACE(span-root)>', id, tags);
      },
      logDebug(id, tags) {
        console.log('DEMO > FALLBACK-TRACE(log-debug)>', id, tags);
      },
      finishSpan() {
        console.log('DEMO > FALLBACK-TRACE>(finish-span)');
      }
    };
  };

  const createAllInPageTracer = () => {
    const traceTable = document.querySelector('.trace-table');
    const indentSizePx = 30;
    const traceColumns = [
      { 
        renderCell(node, controller, trIndex) {
          const renderIndent = (size) => {
            const span = document.createElement('span');
            span.style.cssText = `width:${size * indentSizePx}px;display:inline-block;`;
            return span;
          };
          const renderToggleAnchor = () => {
            const anchor = document.createElement('a');
            anchor.style.cssText = `width:${indentSizePx}px;display:inline-block;`;
            anchor.onclick = () => {
              controller.toggle(node.id);
            };
            anchor.innerHTML = '[+]';
            return anchor;
          };
          return [
            renderIndent(node.firstChild ? node.depth : node.depth + 1),
            node.firstChild ? renderToggleAnchor() : undefined,
            `${node.entry.messageId}`
          ];
        }
      },
      {
        renderCell(node, controller, trIndex) {
          return [`${node.entry.time}`];
        }
      },
      {
        renderCell(node, controller, trIndex) {
          return [`details...`];
        }
      }
    ];
    
    const { input, output } = CodePath.createCodePath();
    const model = CodePath.createCodePathModel();
    const view = CodePath.createTreeGridView(traceTable, traceColumns);
    const controller = CodePath.createTreeGridController(view, model);

    setInterval(() => {
      if (output.peekEntries().length > 0) {
        const entries = output.takeEntries();
        console.log('DEMO>ENTRIES>', entries);
        model.publish(entries);
      }
    }, 250);
  
    console.info('DEMO>', 'successfully initialized all-in-page');
    return input;
  };

  const createdDeferredPromise = () => {
    let resolve = undefined;
    let reject = undefined;
    const promise = new Promise((theResolve, theReject) => {
      resolve = theResolve;
      reject = theReject;
    });
    return {
      promise,
      resolve,
      reject
    };
  };
  
  const delay = (ms) => {
    const { promise, resolve } = createdDeferredPromise();
    setTimeout(resolve, ms);
    return promise;
  }
  
  const init = () => {
    console.log('DEMO> CodePath =', CodePath);

    let tracer = createFallbackTracer(); //createAllInPageTracer(); 

    window.__CODEPATH_INJECTOR__ = (newTracer) => {
      tracer = newTracer;
    };

    window.CodePath = CodePath;

    if (typeof window.__CODEPATH_INJECTOR_READY__ === 'function') {
      window.__CODEPATH_INJECTOR_READY__();
    }

    console.log('DEMO> injector installed');

    let demoCounter1 = 0;
    let demoCounter2 = 0;
    
    const button1 = document.querySelector('.button-1');
    button1.onclick = (e) => {
      demoCounter1++;
      tracer.spanChild(`button-1-click#${demoCounter1}`, { x: e.clientX, y: e.clientY, demoCounter1 });
      tracer.logDebug('first-message', { a: 1, b: 2 } );
      tracer.logDebug('second-message');
      tracer.spanChild('third-sub-span', { abc: 123 });
      tracer.logDebug('fifth-message');
      tracer.finishSpan();
      tracer.logDebug('sixth-message', { c: 3, d: 4 } );
      tracer.logDebug('seventh-message');
      tracer.finishSpan();
    };

    const button2 = document.querySelector('.button-2');
    button2.onclick = async () => {
      demoCounter2++;

      const asyncTaskOne = async () => {
        tracer.spanChild('AT1-S1');
        await trace(delay(1000));
        tracer.logEvent('AT1-E1');
        tracer.finishSpan();
        return 111;
      }
  
      const asyncTaskTwo = async () => {
        tracer.spanChild('AT2-S1');
        await trace(delay(100));
        tracer.logEvent('AT2-E1');
        tracer.finishSpan();
        return 222;
      }
      
      tracer.spanRoot(`R0#${demoCounter2}`, {  demoCounter2 });
  
      const taskPromiseOne = trace(() => asyncTaskOne()).then(value => {
        tracer.spanChild('AT1-S2');
        tracer.logEvent('AT1-E2', {value});
        tracer.finishSpan();
        return value;
      });
  
      const taskPromiseTwo = trace(() => asyncTaskTwo()).then(value => {
        tracer.spanChild('AT2-S2');
        tracer.logEvent('AT2-E2', {value});
        tracer.finishSpan();
        return value;
      });
  
      const valueOne = await trace(taskPromiseOne);
      const valueTwo = await trace(taskPromiseTwo);
  
      tracer.logEvent('E1', {valueOne, valueTwo});
      tracer.finishSpan();
    };
  };

  const { readyState } = document;
  if (readyState === "complete" || readyState === "loaded" || readyState === "interactive") {
    init(); 
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }

});
