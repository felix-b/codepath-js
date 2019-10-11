import { LOG_LEVEL } from "./logLevel";

let currentScopeManager = createInternalScopeManager();

export function trace(promiseOrFunc) {
  const logToActiveSpan = tags => {
    const activeSpan = currentScopeManager.getActiveSpan();
    if (activeSpan) {
      activeSpan.log(tags);
    }
  };

  const callerScopeManager = currentScopeManager.clone();

  const originalPromise =
    typeof promiseOrFunc === "function" ? promiseOrFunc() : promiseOrFunc;

  const saveScopeManager = currentScopeManager;

  const wrapperPromise = new Promise((resolve, reject) => {
    originalPromise
      .then(value => {
        currentScopeManager = saveScopeManager;
        logToActiveSpan({
          $id: "async-then",
          $async: "then",
          level: LOG_LEVEL.debug,
          value
        });
        resolve(value);
      })
      .catch(err => {
        currentScopeManager = saveScopeManager;
        logToActiveSpan({
          $id: "async-catch",
          $async: "catch",
          level: LOG_LEVEL.error,
          error: {
            message: err.message,
            stack: err.stack
          }
        });
        reject(err);
      });
  });

  currentScopeManager = callerScopeManager;
  return wrapperPromise;
}

export function createDefaultScopeManager() {
  return {
    getActiveTracer() {
      return currentScopeManager.getActiveTracer();
    },
    getActiveSpan() {
      return currentScopeManager.getActiveSpan();
    },
    setActiveTracer(tracer) {
      currentScopeManager.setActiveTracer(tracer);
    },
    setActiveSpan(span) {
      currentScopeManager.setActiveSpan(span);
    }
  };
}

export function resetCurrentScope() {
  currentScopeManager = createInternalScopeManager();
}

function createInternalScopeManager(source) {
  let activeTracer = source ? source.getActiveTracer() : undefined;
  let activeSpan = source ? source.getActiveSpan() : undefined;
  const thisScopeManager = {
    getActiveTracer() {
      return activeTracer;
    },
    getActiveSpan() {
      return activeSpan;
    },
    setActiveTracer(tracer) {
      activeTracer = tracer;
    },
    setActiveSpan(span) {
      activeSpan = span;
    },
    clone() {
      return createInternalScopeManager(thisScopeManager);
    }
  };
  return thisScopeManager;
}
