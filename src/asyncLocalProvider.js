import { createMulticastDelegate } from "./multicastDelegate";

const originalPromise = window.Promise;

let debugCurrentStep = 'INIT';
const debugPromiseLifecycle = [];

export function setDebugCurrentStep(step) {
  debugCurrentStep = step;
  debugPromiseLifecycle.push({
    step
  });
}

export function getDebugPromiseLifecycle() {
  return debugPromiseLifecycle;
}

export function restoreOriginalPromise() {
  window.Promise = originalPromise;
}

export const pushLifecycleEntry = (instanceId, phase, currentLocals) => {
  debugPromiseLifecycle.push({
    instance: instanceId,
    phase,
    locals: `${currentLocals}`,
    step: debugCurrentStep
  });
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
    _thisInstanceId;
    _parentLocals;
    _thisLocals;

    constructor(executor) {
      const parentLocals = currentLocals;
      const thisLocals = cloneCurrentLocals();
      const thisInstanceId = nextInstanceId++;

      console.log(`PrmoseWrapper[${thisInstanceId}].ctor`);
      pushLifecycleEntry(thisInstanceId, '.ctor-enter', currentLocals);

      super(function(resolve, reject) {
        pushLifecycleEntry(thisInstanceId, 'super-enter', currentLocals);

        const wrapperResolve = value => {
          currentLocals = parentLocals;
          try {
            console.log(`PromiseWrapper[${thisInstanceId}].resolve(${value})`);
            //completionHooks.invoke(value, thisInstanceId);
            pushLifecycleEntry(thisInstanceId, 'resolve-before', currentLocals);
            resolve(value);
            pushLifecycleEntry(thisInstanceId, 'resolve-after', currentLocals);
          } finally {
            currentLocals = parentLocals;
          }
        };
        const wrapperReject = error => {
          currentLocals = parentLocals;
          try {
            console.log(`PromiseWrapper[${thisInstanceId}].reject(${error})`);
            //rejectionHooks.invoke(error, thisInstanceId);
            pushLifecycleEntry(thisInstanceId, 'reject-before', currentLocals);
            reject(error);
            pushLifecycleEntry(thisInstanceId, 'reject-after', currentLocals);
          } finally {
            currentLocals = parentLocals;
          }
        };
        currentLocals = thisLocals;
        try {
          pushLifecycleEntry(thisInstanceId, 'executor-before', currentLocals);
          const executorResult = executor(wrapperResolve, wrapperReject);
          pushLifecycleEntry(thisInstanceId, 'executor-after', currentLocals);
          return executorResult;
        } finally {
          currentLocals = parentLocals;
          pushLifecycleEntry(thisInstanceId, 'super-exit', currentLocals);
        }
      });

      this._thisInstanceId = thisInstanceId;
      this._parentLocals = parentLocals;
      this._thisLocals = thisLocals;

      pushLifecycleEntry(thisInstanceId, '.ctor-exit', currentLocals);
    }

    then(success, reject) {
      const thisInstanceId = this._thisInstanceId;
      const parentLocals = this._parentLocals;
      const thisLocals = this._thisLocals;

      pushLifecycleEntry(thisInstanceId, 'then-set-before-super', currentLocals);
      const thenResult = super.then(
        (result) => {
          currentLocals = parentLocals;
          pushLifecycleEntry(thisInstanceId, 'then-success-before', currentLocals);
          try {
            console.log(`PromiseWrapper[${thisInstanceId}].then(${result})`);
            completionHooks.invoke(result, thisInstanceId);
            success(result);
          } finally {
            currentLocals = parentLocals;
            pushLifecycleEntry(thisInstanceId, 'then-success-after', currentLocals);
          }

        }, 
        (error) => {
          currentLocals = parentLocals;
          pushLifecycleEntry(thisInstanceId, 'then-reject-before', currentLocals);
          try {
            console.log(`PromiseWrapper[${thisInstanceId}].catch(${error})`);
            rejectionHooks.invoke(error, thisInstanceId);
            reject(error);
          } finally {
            currentLocals = parentLocals;
            pushLifecycleEntry(thisInstanceId, 'then-reject-after', currentLocals);
          }
        }
      );

      pushLifecycleEntry(thisInstanceId, 'then-set-after-super', currentLocals);
      return thenResult;
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
