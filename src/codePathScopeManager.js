import { LOG_LEVEL } from "./logLevel";

//let currentScopeManager = createInternalScopeManager();

// export function trace(promiseOrFunc) {
//   const logToActiveSpan = tags => {
//     const activeSpan = currentScopeManager.getActiveSpan();
//     if (activeSpan) {
//       activeSpan.log(tags);
//     }
//   };

//   const callerScopeManager = currentScopeManager.clone();

//   const originalPromise =
//     typeof promiseOrFunc === "function" ? promiseOrFunc() : promiseOrFunc;

//   const saveScopeManager = currentScopeManager;

//   const wrapperPromise = new Promise((resolve, reject) => {
//     originalPromise
//       .then(value => {
//         currentScopeManager = saveScopeManager;
//         logToActiveSpan({
//           $id: "async-then",
//           $async: "then",
//           level: LOG_LEVEL.debug,
//           value
//         });
//         resolve(value);
//       })
//       .catch(err => {
//         currentScopeManager = saveScopeManager;
//         logToActiveSpan({
//           $id: "async-catch",
//           $async: "catch",
//           level: LOG_LEVEL.error,
//           error: {
//             message: err.message,
//             stack: err.stack
//           }
//         });
//         reject(err);
//       });
//   });

//   currentScopeManager = callerScopeManager;
//   return wrapperPromise;
// }

export function createDefaultScopeManager(asyncLocalProvider) {
  const activeTracer = asyncLocalProvider.createAsyncLocal();
  const activeSpan = asyncLocalProvider.createAsyncLocal();

  const logToActiveSpan = tags => {
    const span = activeSpan.get();
    if (span) {
      span.log(tags);
    }
  };

  asyncLocalProvider.addPromiseCompletionHook(value => {
    //console.log('COMPLETION-HOOK!');
    logToActiveSpan({
      $id: "async-then",
      $async: "then",
      level: LOG_LEVEL.debug,
      value
    });
  });

  asyncLocalProvider.addPromiseRejectionHook(err => {
    //console.log('REJECTION-HOOK!');
    logToActiveSpan({
      $id: "async-catch",
      $async: "catch",
      level: LOG_LEVEL.error,
      error: {
        message: err.message,
        stack: err.stack
      }
    });
  });

  return {
    getActiveTracer() {
      return activeTracer.get();
    },
    getActiveSpan() {
      return activeSpan.get();
    },
    setActiveTracer(tracer) {
      activeTracer.set(tracer);
    },
    setActiveSpan(span) {
      activeSpan.set(span);
    }
  };
}

export function resetCurrentScope() {}
