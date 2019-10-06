define(function (require) {
  let tracer = null;
  let trace = null;

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

  const initInjector = () => {
    window.__CODEPATH_INJECTOR__ = (newTracer, codePathLib, configure) => {
      window.CodePath = codePathLib;
      trace = CodePath.trace;
      tracer = newTracer;

      configure({
        treeGrid: {
          rowClass: [
            { tag: 'level', value: 3, className: 'error' },
            { tag: 'level', value: 2, className: 'warning' },
            { tag: 'level', value: 1, className: 'info' },
            { tag: 'level', className: 'debug' },
          ]
        }
      });

      console.log('DEMO> CodePath =', CodePath, 'trace = ', trace);

      initializeDemoButtons();

      window.__CODEPATH_ENABLE_DEBUG__ = () => {
        window.CodePath.enableDebugLog(true);
      }
    };

    console.log('DEMO> injector installed');

    if (typeof window.__CODEPATH_INJECTOR_READY__ === 'function') {
      window.__CODEPATH_INJECTOR_READY__();
    }
  };

  function initializeDemoButtons() {
    let demoCounter1 = 0;
    let demoCounter2 = 0;
    
    const button1 = document.querySelector('.button-1');
    button1.onclick = (e) => {
      demoCounter1++;
      tracer.spanRoot(`button-1-click#${demoCounter1}`, { x: e.clientX, y: e.clientY, demoCounter1 });
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
      
      tracer.spanRoot(`R0#${demoCounter2}`, { demoCounter2 });
  
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
  }

  const runStressIteration = async (stressCounter1) => {

    const asyncTaskOne = async () => {
      tracer.spanChild('STRESS-AT1-S1', { stressCounter1 });
      tracer.logDebug('STRESS-D1', { stressCounter1, x: 1, y: 2 });
      await trace(delay(20));
      tracer.logEvent('STRESS-AT1-E1', { stressCounter1 });
      tracer.logDebug('STRESS-D2', { stressCounter1, z: 3, w: 4 });
      tracer.logWarning('STRESS-D3', { stressCounter1, p: 5, q: 6 });
      tracer.finishSpan();
      return 111;
    }

    const asyncTaskTwo = async () => {
      tracer.spanChild('STRESS-AT2-S1', { stressCounter1 });
      tracer.logDebug('STRESS-D4', { stressCounter1, aaa: 123, bbb: 456 });
      tracer.logWarning('STRESS-D5', { stressCounter1, ccc: 789, ddd: 1230 });
      await trace(delay(10));
      if (stressCounter1 === 13) {
        throw new Error("Bad, bad, bad!");
      }
      tracer.logEvent('STRESS-AT2-E1', { stressCounter1 });
      tracer.finishSpan();
      return 222;
    }

    tracer.spanRoot(`STRESS#${stressCounter1}`, { stressCounter1 });
  
    const taskPromiseOne = trace(() => asyncTaskOne()).then(value => {
      tracer.spanChild('STRESS-AT1-S2', { stressCounter1 });
      tracer.logEvent('STRESS-AT1-E2', { stressCounter1, value });
      tracer.finishSpan();
      return value;
    });

    const taskPromiseTwo = trace(() => asyncTaskTwo()).then(value => {
      tracer.spanChild('STRESS-AT2-S2', { stressCounter1 });
      tracer.logEvent('STRESS-AT2-E2', { stressCounter1, value} );
      tracer.finishSpan();
      return value;
    });

    const valueOne = await trace(taskPromiseOne);
    const valueTwo = await trace(taskPromiseTwo);

    tracer.logEvent('STRESS-E1', {stressCounter1, valueOne, valueTwo});
    tracer.finishSpan();
  };

  const runStressLoop = async (button, count) => {
    const runningText = ' (RUNNING...)';
    button.disabled = true;
    button.innerHTML += runningText;

    const startMarker = `runStressLoop[${count}].iteration:begin`;
    const endMarker = `runStressLoop[${count}].iteration:end`;

    for (let i = 0 ; i < count ; i++) {
      performance.mark(startMarker);
      
      runStressIteration(i);
      
      performance.mark(endMarker);
      performance.measure(`runStressLoop[${count}].iteration`, startMarker, endMarker);

      await delay(15);
    }

    button.disabled = false;
    button.innerHTML = button.innerHTML.replace(runningText, '');
  };

  document.querySelector('.button-3').onclick = (e) => runStressLoop(e.target, 5);
  document.querySelector('.button-4').onclick = (e) => runStressLoop(e.target, 20);
  document.querySelector('.button-5').onclick = (e) => runStressLoop(e.target, 60);
  document.querySelector('.button-6').onclick = (e) => runStressLoop(e.target, 120);
  document.querySelector('.button-7').onclick = (e) => runStressLoop(e.target, 1200);

  const { readyState } = document;
  if (readyState === "complete" || readyState === "loaded" || readyState === "interactive") {
    initInjector(); 
  } else {
    window.addEventListener('DOMContentLoaded', initInjector);
  }

});
