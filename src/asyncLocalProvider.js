import { createMulticastDelegate } from "./multicastDelegate";

const originalPromise = window.Promise;

let debugCurrentStep = 'INIT';
const debugPromiseLifecycle = [];
let globalGetCurrentLocals = undefined;

const formatLocals = (locals) => {
  return `#${locals.__INSTANCE_ID__} ${[...locals.values()].join(';')}`;
}

export function setDebugCurrentStep(step) {
  const locals = globalGetCurrentLocals
    ? formatLocals(globalGetCurrentLocals())
    : 'N/A';
  debugCurrentStep = step;
  debugPromiseLifecycle.push({
    step,
    locals
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
    locals: formatLocals(currentLocals),
    step: debugCurrentStep
  });
}

export const pushCloneEntry = (instanceId, fromLocals, toLocals) => {
  debugPromiseLifecycle.push({
    instance: instanceId,
    clone: `${fromLocals.__INSTANCE_ID__ || 'empty'}->${toLocals.__INSTANCE_ID__}`,
  });
}

export const pushAssignEntry = (toLocals, key, value) => {
  debugPromiseLifecycle.push({
    assign: `#${toLocals.__INSTANCE_ID__}[${key}]<-${value}`,
  });
}

export function createAsyncLocalProvider() {
  let nextLocalsInstanceId = 1;
  const cloneLocals = (instanceId, source) => {
    const clone = new Map(source.entries());
    clone.__INSTANCE_ID__ = nextLocalsInstanceId++;
    pushCloneEntry(instanceId, source, clone);
    return clone;
  }

  let currentLocals = cloneLocals('N/A', new Map());

  const getCurrentLocals = () => currentLocals;
  globalGetCurrentLocals = getCurrentLocals;

  const cloneCurrentLocals = (instanceId) => cloneLocals(instanceId, currentLocals);
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
      const thisInstanceId = nextInstanceId++;
      const thisLocals = cloneCurrentLocals(thisInstanceId);

      console.log(`PrmoseWrapper[${thisInstanceId}].ctor`);
      pushLifecycleEntry(thisInstanceId, '.ctor-enter', currentLocals);

      super(function(resolve, reject) {
        pushLifecycleEntry(thisInstanceId, 'super-enter', currentLocals);

        const wrapperResolve = value => {
          pushLifecycleEntry(thisInstanceId, 'resolve-before-save-locals', currentLocals);
          const saveLocals = currentLocals;
          currentLocals = thisLocals;
          try {
            console.log(`PromiseWrapper[${thisInstanceId}].resolve(${value})`);
            //completionHooks.invoke(value, thisInstanceId);
            pushLifecycleEntry(thisInstanceId, 'resolve-before', currentLocals);
            resolve(value);
            pushLifecycleEntry(thisInstanceId, 'resolve-after', currentLocals);
          } finally {
            currentLocals = saveLocals;
            pushLifecycleEntry(thisInstanceId, 'resolve-after-restore-locals', currentLocals);
          }
        };
        const wrapperReject = error => {
          pushLifecycleEntry(thisInstanceId, 'reject-before-save-locals', currentLocals);
          const saveLocals = currentLocals;
          currentLocals = thisLocals;
          try {
            console.log(`PromiseWrapper[${thisInstanceId}].reject(${error})`);
            //rejectionHooks.invoke(error, thisInstanceId);
            pushLifecycleEntry(thisInstanceId, 'reject-before', currentLocals);
            reject(error);
            pushLifecycleEntry(thisInstanceId, 'reject-after', currentLocals);
          } finally {
            currentLocals = saveLocals;
            pushLifecycleEntry(thisInstanceId, 'reject-after-restore-locals', currentLocals);
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
          pushLifecycleEntry(thisInstanceId, 'executor-after-restore-locals', currentLocals);
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
      const thenLocals = cloneLocals(thisInstanceId, currentLocals);
      
      pushLifecycleEntry(thisInstanceId, 'then-set-before-super', currentLocals);
      const thenResult = super.then(
        (result) => {
          pushLifecycleEntry(thisInstanceId, 'then-success-before-save-locals', currentLocals);
          const saveLocals = currentLocals;
          currentLocals = thenLocals;
          pushLifecycleEntry(thisInstanceId, 'then-success-before', currentLocals);
          try {
            console.log(`PromiseWrapper[${thisInstanceId}].then(${result})`);
            completionHooks.invoke(result, thisInstanceId);
            success(result);
          } finally {
            pushLifecycleEntry(thisInstanceId, 'then-success-after', currentLocals);
            currentLocals = saveLocals;
            pushLifecycleEntry(thisInstanceId, 'then-success-after-restore-locals', currentLocals);
          }

        }, 
        (error) => {
          pushLifecycleEntry(thisInstanceId, 'then-reject-before-save-locals', currentLocals);
          const saveLocals = currentLocals;
          currentLocals = thenLocals;
          pushLifecycleEntry(thisInstanceId, 'then-reject-before', currentLocals);
          try {
            console.log(`PromiseWrapper[${thisInstanceId}].catch(${error})`);
            rejectionHooks.invoke(error, thisInstanceId);
            reject(error);
          } finally {
            pushLifecycleEntry(thisInstanceId, 'then-reject-after', currentLocals);
            currentLocals = saveLocals;
            pushLifecycleEntry(thisInstanceId, 'then-reject-after-restore-locals', currentLocals);
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
          pushAssignEntry(getCurrentLocals(), key, newValue);
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
