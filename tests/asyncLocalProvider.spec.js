import { 
  restoreOriginalPromise, 
  createAsyncLocalProvider,
  setDebugCurrentStep,
  getDebugPromiseLifecycle
} from "../src/asyncLocalProvider";

const createdDeferredPromise = () => {
  let resolve = undefined;
  let reject = undefined;
  const promise = new Promise((theResolve, theReject) => {
    setDebugCurrentStep('createdDeferredPromise() executor');
    resolve = theResolve;
    reject = theReject;
  });
  return {
    promise,
    resolve,
    reject
  };
};

const delay = (milliseconds) => {
  setDebugCurrentStep('DELAY-ENTER');
  console.log('delay-enter');
  const promise = new Promise(resolve => {
    setDebugCurrentStep('DELAY-SET-TIMEOUT-ENTER');
    setTimeout(resolve, milliseconds);
    setDebugCurrentStep('DELAY-SET-TIMEOUT-EXIT');
  });
  console.log('delay-exit');
  setDebugCurrentStep('DELAY-EXIT');
  return promise;
} 

describe('asyncLocalProvider', () => {

  afterEach(() => {
    restoreOriginalPromise();
  });

  it('is initially empty', () => {
    const provider = createAsyncLocalProvider();

    const locals = provider.cloneCurrentLocals();

    expect([...locals.keys()]).toEqual([]);
  });

  it('can create locals', () => {
    const provider = createAsyncLocalProvider();

    const local1 = provider.createAsyncLocal(123);
    const local2 = provider.createAsyncLocal(456);

    const value1 = local1.get();
    const value2 = local2.get();
    const allLocals = provider.cloneCurrentLocals();

    expect(value1).toBe(123);
    expect(value2).toBe(456);
    expect([...allLocals.values()]).toEqual([123, 456]);
  });

  it('can set locals values', () => {
    const provider = createAsyncLocalProvider();

    const local1 = provider.createAsyncLocal(123);
    const local2 = provider.createAsyncLocal(456);

    local1.set(777);
    local2.set(999);

    const value1 = local1.get();
    const value2 = local2.get();
    const allLocals = provider.cloneCurrentLocals();

    expect(value1).toBe(777);
    expect(value2).toBe(999);
    expect([...allLocals.values()]).toEqual([777, 999]);
  });

  it('can remove locals', () => {
    const provider = createAsyncLocalProvider();

    const local1 = provider.createAsyncLocal(123);
    const local2 = provider.createAsyncLocal(456);

    local1.remove();

    const value1 = local1.get();
    const value2 = local2.get();
    const allLocals = provider.cloneCurrentLocals();

    expect(value1).toBeUndefined();
    expect(value2).toBe(456);
    expect([...allLocals.values()]).toEqual([456]);
  });

  it.skip('can flow locals to Promise.then', async () => {
    const provider = createAsyncLocalProvider();
    const local = provider.createAsyncLocal('A1');
    let log = {};

    setDebugCurrentStep('ROOT-ENTER');
    log['init'] = local.get();

    local.set('A2');

    log['before-await'] = local.get();

    await delay(10).then(() => {
      log['enter-then'] = local.get();
      local.set('B1');
      log['exit-then'] = local.get();
    });

    log['after-await'] = local.get();

    expect(log).toMatchObject({
      'init': 'A1',
      'before-await': 'A2',
      'enter-then': 'A2',
      'exit-then': 'B1',
      'after-await': 'A2',
    });
  });

  it('can flow locals over await', async () => {
    const provider = createAsyncLocalProvider();
    const local = provider.createAsyncLocal('A1');
    let log = {};

    setDebugCurrentStep('ROOT-ENTER');
    log['init'] = local.get();
    local.set('A2');

    const asyncTask1 = async () => {
      setDebugCurrentStep('AT1-ENTER');
      log['async-task-1-start'] = local.get();
      local.set('B1');
      log['async-task-1-before-await'] = local.get();

      setDebugCurrentStep('AT1-WILL-CREATE-DELAY-PROMISE');
      const delayPromise = delay(10);
      setDebugCurrentStep('AT1-BEFORE-AWAIT');
      await delayPromise;
      setDebugCurrentStep('AT1-AFTER-AWAIT');

      log['async-task-1-after-await'] = local.get();
      local.set('B2');
      setDebugCurrentStep('AT1-EXIT');
    };

    log['before-async-tasks'] = local.get();
    setDebugCurrentStep('ROOT-BEFORE-AWAIT');

    await asyncTask1();

    setDebugCurrentStep('ROOT-AFTER-AWAIT');
    log['after-async-tasks'] = local.get();

    const debugLifecycle = getDebugPromiseLifecycle();

    expect(log).toMatchObject({
      'init': 'A1',
      'before-async-tasks': 'A2',
      'async-task-1-start': 'A2',
      'async-task-1-before-await': 'B1',
      'async-task-1-after-await': 'B1',
      'after-async-tasks': 'A2',
    });
  });

  it('can flow locals over multiple serial awaits', async () => {
    const provider = createAsyncLocalProvider();
    const local = provider.createAsyncLocal('A1');
    let log = {};

    setDebugCurrentStep('ROOT-ENTER');
    log['init'] = local.get();
    local.set('A2');

    const asyncTask2 = async () => {
      setDebugCurrentStep('AT2-ENTER');
      log['async-task-2-start'] = local.get();
      local.set('C1');
      log['async-task-2-before-await'] = local.get();

      setDebugCurrentStep('AT2-WILL-CREATE-DELAY-PROMISE');
      const delayPromise = delay(10);
      setDebugCurrentStep('AT2-BEFORE-AWAIT');
      await delayPromise;
      setDebugCurrentStep('AT2-AFTER-AWAIT');

      log['async-task-2-after-await'] = local.get();
      local.set('C2');
      setDebugCurrentStep('AT2-EXIT');
    };

    const asyncTask1 = async () => {
      setDebugCurrentStep('AT1-ENTER');
      log['async-task-1-start'] = local.get();
      local.set('B1');
      log['async-task-1-before-await'] = local.get();

      setDebugCurrentStep('AT1-WILL-CREATE-DELAY-PROMISE');
      const task2Promise = asyncTask2();
      setDebugCurrentStep('AT1-BEFORE-AWAIT');
      await task2Promise;
      setDebugCurrentStep('AT1-AFTER-AWAIT');

      log['async-task-1-after-await'] = local.get();
      local.set('B2');
      setDebugCurrentStep('AT1-EXIT');
    };

    log['before-async-tasks'] = local.get();
    setDebugCurrentStep('ROOT-BEFORE-AWAIT');

    await asyncTask1();

    setDebugCurrentStep('ROOT-AFTER-AWAIT');
    log['after-async-tasks'] = local.get();

    const debugLifecycle = getDebugPromiseLifecycle();

    expect(log).toMatchObject({
      'init': 'A1',
      'before-async-tasks': 'A2',
      'async-task-1-start': 'A2',
      'async-task-1-before-await': 'B1',
      'async-task-2-start': 'B1',
      'async-task-2-before-await': 'C1',
      'async-task-2-after-await': 'C1',
      'async-task-1-after-await': 'B1',
      'after-async-tasks': 'A2',
    });
  });

  it('can flow locals over multiple parallel awaits', async () => {
    const provider = createAsyncLocalProvider();
    const local = provider.createAsyncLocal('A1');
    let log = {};

    setDebugCurrentStep('ROOT-ENTER');
    console.log(log['init'] = local.get());
    local.set('A2');

    const asyncTask2 = async () => {
      setDebugCurrentStep('AT2-ENTER');
      console.log(log['async-task-2-start'] = local.get());
      local.set('C1');
      console.log(log['async-task-2-before-await'] = local.get());

      setDebugCurrentStep('AT2-WILL-CREATE-DELAY-PROMISE');
      const delayPromise = delay(100);
      setDebugCurrentStep('AT2-BEFORE-AWAIT');
      await delayPromise;
      setDebugCurrentStep('AT2-AFTER-AWAIT');

      console.log(log['async-task-2-after-await'] = local.get());
      local.set('C2');
      setDebugCurrentStep('AT2-EXIT');
    };

    const asyncTask1 = async () => {
      setDebugCurrentStep('AT1-ENTER');
      console.log(log['async-task-1-start'] = local.get());
      local.set('B1');
      console.log(log['async-task-1-before-await'] = local.get());

      setDebugCurrentStep('AT1-WILL-CREATE-DELAY-PROMISE');
      const delayPromise = delay(10);
      setDebugCurrentStep('AT1-BEFORE-AWAIT');
      await delayPromise;
      setDebugCurrentStep('AT1-AFTER-AWAIT');

      console.log(log['async-task-1-after-await'] = local.get());
      local.set('B2');
      setDebugCurrentStep('AT1-EXIT');
    };

    console.log(log['before-await-task-2'] = local.get());
    setDebugCurrentStep('ROOT-BEFORE-AWAIT');

    await asyncTask2();
    
    console.log(log['after-await-task-2'] = local.get());

    local.set('A3');
    
    console.log(log['before-await-task-1'] = local.get());
    
    await asyncTask1();

    setDebugCurrentStep('ROOT-AFTER-AWAIT');
    console.log(log['after-await-task-1'] = local.get());

    const debugLifecycle = getDebugPromiseLifecycle();

    expect(log).toMatchObject({
      'init': 'A1',
      'before-await-task-2': 'A2',
      'async-task-2-start': 'A2',
      'async-task-2-before-await': 'C1',
      'async-task-2-after-await': 'C1',
      'after-await-task-2': 'A2',
      'before-await-task-1': 'A3',
      'async-task-1-start': 'A3',
      'async-task-1-before-await': 'B1',
      'async-task-1-after-await': 'B1',
      'after-await-task-1': 'A3',
    });
  });

  it('can flow locals over multiple parallel async tasks with Promise.all', async () => {
    const provider = createAsyncLocalProvider();
    const local = provider.createAsyncLocal('A1');
    let log = {};

    setDebugCurrentStep('ROOT-ENTER');
    console.log(log['init'] = local.get());
    local.set('A2');

    const asyncTask2 = async () => {
      setDebugCurrentStep('AT2-ENTER');
      console.log(log['async-task-2-start'] = local.get());
      local.set('C1');
      console.log(log['async-task-2-before-await'] = local.get());

      setDebugCurrentStep('AT2-WILL-CREATE-DELAY-PROMISE');
      const delayPromise = delay(100);
      setDebugCurrentStep('AT2-BEFORE-AWAIT');
      await delayPromise;
      setDebugCurrentStep('AT2-AFTER-AWAIT');

      console.log(log['async-task-2-after-await'] = local.get());
      local.set('C2');
      setDebugCurrentStep('AT2-EXIT');
    };

    const asyncTask1 = async () => {
      setDebugCurrentStep('AT1-ENTER');
      console.log(log['async-task-1-start'] = local.get());
      local.set('B1');
      console.log(log['async-task-1-before-await'] = local.get());

      setDebugCurrentStep('AT1-WILL-CREATE-DELAY-PROMISE');
      const delayPromise = delay(10);
      setDebugCurrentStep('AT1-BEFORE-AWAIT');
      await delayPromise;
      setDebugCurrentStep('AT1-AFTER-AWAIT');

      console.log(log['async-task-1-after-await'] = local.get());
      local.set('B2');
      setDebugCurrentStep('AT1-EXIT');
    };

    console.log(log['before-promise-all'] = local.get());
    setDebugCurrentStep('ROOT-BEFORE-AWAIT');

    await Promise.all([
      asyncTask1(),
      asyncTask2()
    ]);
    
    setDebugCurrentStep('ROOT-AFTER-AWAIT');
    console.log(log['after-promise-all'] = local.get());

    const debugLifecycle = getDebugPromiseLifecycle();

    expect(log).toMatchObject({
      'init': 'A1',
      'before-promise-all': 'A2',
      'async-task-2-start': 'A2',
      'async-task-2-before-await': 'C1',
      'async-task-2-after-await': 'C1',
      'async-task-1-start': 'A2',
      'async-task-1-before-await': 'B1',
      'async-task-1-after-await': 'B1',
      'after-promise-all': 'A2',
    });
  });

  it.only('can flow locals over to concurrent async tasks', async () => {
    const provider = createAsyncLocalProvider();
    const local = provider.createAsyncLocal('R1');

    setDebugCurrentStep('ROOT-ENTER');

    const stepsDone = [
      createdDeferredPromise(),
      createdDeferredPromise(),
    ];

    setDebugCurrentStep('ROOT-CREATED-DEFERRED-PROMISES');
    let log = {};

    console.log(log['root-init'] = local.get());
    local.set('R2');

    const asyncTask1 = async () => {
      setDebugCurrentStep('AT1-ENTER');
      
      console.log(log['async-task-1-start'] = local.get());
      local.set('AT1-1');
      console.log(log['async-task-1-before-await'] = local.get());
      
      setDebugCurrentStep('AT1-WILL-AWAIT-STEP-0');
      
      await stepsDone[0].promise;

      setDebugCurrentStep('AT1-CONTINUE-AFTER-STEP-0');

      console.log(log['async-task-1-after-await'] = local.get());
      local.set('AT1-2');
      setDebugCurrentStep('AT1-WILL-RESOLVE-STEP-1');
      stepsDone[1].resolve();
      console.log(log['async-task-1-after-resolve-step-1'] = local.get());
      setDebugCurrentStep('AT1-EXIT');
    };

    const asyncTask2 = async () => {
      setDebugCurrentStep('AT2-ENTER');
      
      console.log(log['async-task-2-start'] = local.get());
      local.set('AT2-1');
      console.log(log['async-task-2-before-resolve-step-0'] = local.get());

      setDebugCurrentStep('AT2-WILL-RESOLVE-STEP-0');
      stepsDone[0].resolve();
      setDebugCurrentStep('AT2-AFTER-RESOLVE-STEP-0');
      
      console.log(log['async-task-2-after-resolve-step-0'] = local.get());
      local.set('AT2-2');
      setDebugCurrentStep('AT2-WILL-AWAIT-STEP-1');
      console.log(log['async-task-2-before-await-step-1'] = local.get());

      await stepsDone[1].promise;

      console.log(log['async-task-2-after-await-step-1'] = local.get());
      local.set('AT2-3');
      setDebugCurrentStep('AT2-EXIT');
    };

    console.log(log['root-before-await'] = local.get());

    setDebugCurrentStep('ROOT-BEFORE-RUN-AT1');
    const promiseAT1 = asyncTask1();

    setDebugCurrentStep('ROOT-BEFORE-RUN-AT2');
    const promiseAT2 = asyncTask2();

    setDebugCurrentStep('ROOT-BEFORE-PROMISE-ALL');
    const promiseAll = Promise.all([
      promiseAT1, 
      promiseAT2
    ]);

    setDebugCurrentStep('ROOT-BEFORE-AWAIT-PROMISE-ALL');

    await promiseAll;
    
    setDebugCurrentStep('ROOT-AFTER-AWAIT-PROMISE-ALL');
    console.log(log['root-after-await'] = local.get());

    const debugLifecycle = getDebugPromiseLifecycle();

    expect(log).toMatchObject({
      'root-init': 'R1',
      'root-before-await': 'R2',
      'root-after-await': 'R2',
      'async-task-1-start': 'R2',
      'async-task-1-before-await': 'AT1-1',
      'async-task-1-after-await': 'AT1-1',
      'async-task-1-after-resolve-step-1': 'AT1-2',
      'async-task-2-start': 'R2',
      'async-task-2-before-resolve-step-0': 'AT2-1',
      'async-task-2-after-resolve-step-0': 'AT2-1',
      'async-task-2-before-await-step-1': 'AT2-2',
      'async-task-2-after-await-step-1': 'AT2-2',
    });
  });

});
