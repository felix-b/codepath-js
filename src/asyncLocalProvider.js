import { createMulticastDelegate } from "./multicastDelegate";

const originalPromise = window.Promise;

export function restoreOriginalPromise() {
  window.Promise = originalPromise;
}

export function createAsyncLocalProvider() {
  let currentLocals = new Map();

  const getCurrentLocals = () => currentLocals;
  const cloneCurrentLocals = () => new Map(currentLocals.entries());
  const completionHooks = createMulticastDelegate(
    "AsyncLocalProvider.PromiseCompletion"
  );
  const rejectionHooks = createMulticastDelegate(
    "AsyncLocalProvider.PromiseRejection"
  );

  let nextInstanceId = 1;

  class PromiseWrapper extends Promise {
    constructor(executor) {
      const parentLocals = currentLocals;
      const thisLocals = cloneCurrentLocals();
      const thisInstanceId = nextInstanceId++;

      //console.log(`PrmoseWrapper[${thisInstanceId}].ctor`);

      super(function(resolve, reject) {
        const wrapperResolve = value => {
          currentLocals = thisLocals;
          try {
            //console.log(`PrmoseWrapper[${thisInstanceId}].resolve(${value})`);
            completionHooks.invoke(value, thisInstanceId);
            resolve(value);
          } finally {
            currentLocals = parentLocals;
          }
        };
        const wrapperReject = error => {
          currentLocals = thisLocals;
          try {
            //console.log(`PrmoseWrapper[${thisInstanceId}].reject(${error})`);
            rejectionHooks.invoke(error, thisInstanceId);
            reject(error);
          } finally {
            currentLocals = parentLocals;
          }
        };
        currentLocals = thisLocals;
        try {
          return executor(wrapperResolve, wrapperReject);
        } finally {
          currentLocals = parentLocals;
        }
      });
    }
  }

  window.Promise = PromiseWrapper;

  return {
    createAsyncLocal(initialValue) {
      const key = {};
      getCurrentLocals().set(key, initialValue);
      return {
        get() {
          return getCurrentLocals().get(key);
        },
        set(newValue) {
          getCurrentLocals().set(key, newValue);
        },
        remove() {
          getCurrentLocals().delete(key);
        }
      };
    },
    cloneCurrentLocals,
    addPromiseCompletionHook(callback) {
      completionHooks.add(callback);
    },
    addPromiseRejectionHook(callback) {
      rejectionHooks.add(callback);
    }
  };
}
