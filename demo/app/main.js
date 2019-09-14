define(function (require) {
  const CodePath = require('build/index');

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

  const createAllInPageTracer = () => {
    const traceTable = document.querySelector('.trace-table');
    const traceColumns = [
      { 
        renderCell(node, controller, trIndex) {
          const renderToggleAnchor = () => {
            const anchor = document.createElement('a');
            anchor.onclick = () => {
              controller.toggle(node.id);
            };
            anchor.innerHTML = '[+]';
            return anchor;
          };
          return [
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

  const init = () => {
    console.log('DEMO> CodePath =', CodePath);

    let tracer = createAllInPageTracer(); //createFallbackTracer();

    // window.injectCodePathTracer = (newTracer) => {
    //   tracer = newTracer;
    // };
    // console.log('DEMO> injector installed');

    const button1 = document.querySelector('.button-1');
    button1.onclick = (e) => {
      tracer.spanChild('button-1-click', { x: e.clientX, y: e.clientY });
      tracer.logDebug('first-message', { a: 1, b: 2 } );
      tracer.logDebug('second-message');
      tracer.spanChild('third-sub-span', { abc: 123 });
      tracer.logDebug('fifth-message');
      tracer.finishSpan();
      tracer.logDebug('sixth-message', { c: 3, d: 4 } );
      tracer.logDebug('seventh-message');
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
