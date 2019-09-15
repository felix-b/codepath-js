let currentScopeManager = createInternalScopeManager();

export function trace(promiseOrFunc) {
  const callerScopeManager = currentScopeManager.clone();

  const originalPromise =
    typeof promiseOrFunc === "function" ? promiseOrFunc() : promiseOrFunc;

  const saveScopeManager = currentScopeManager;
  const wrapperPromise = new Promise((resolve, reject) => {
    originalPromise
      .then(value => {
        currentScopeManager = saveScopeManager;
        resolve(value);
      })
      .catch(err => {
        currentScopeManager = saveScopeManager;
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
