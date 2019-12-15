import { 
  createCodePath,
  createDefaultScopeManager, 
  createAsyncLocalProvider,
  resetCurrentScope,
  restoreOriginalPromise,
} from '../src/index';
import { 
  setDebugCurrentStep,
  getDebugPromiseLifecycle
} from "../src/asyncLocalProvider";

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
  console.log('delay-enter');
  setDebugCurrentStep('DELAY-ENTER');
  const { promise, resolve } = createdDeferredPromise();
  setTimeout(() => resolve(`delay(${ms})`), ms);
  console.log('delay-exit');
  setDebugCurrentStep('DELAY-EXIT');
  return promise;
}

describe('DefaultScopeManager', () => {

  beforeEach(() => {
    resetCurrentScope();
    restoreOriginalPromise();
  });

  afterEach(() => {
    restoreOriginalPromise();
  });

  const toAssertableEntryStrings = (output, options) => {
    return output.peekEntries()
      .filter(e => e.token !== 'StartTracer')
      .filter(e => !options || !options.excludeAsync || e.messageId !== 'async-then')
      .map(e => `[${e.spanId}]${e.token}:${e.messageId||''}`);
  }

  it('flows scope across await', async () => {
    const { input, output } = createCodePath();

    const spanS1 = input.spanChild('S1');
    input.logEvent('E1');

    const f1 = async () => {
      console.log('f1-enter');
      const spanS2 = input.spanChild('S2');
      input.logEvent('E2');
      console.log('f1-before-await');
      await delay(10);
      console.log('f1-after-await');
      input.logEvent('E3');
      console.log('f1-exit');
    };

    console.log('before-await-f1');
    await f1();
    console.log('after-await-f1');

    input.logEvent('E4');

    const actualEntries = toAssertableEntryStrings(output);

    // console.log(actualEntries.length); 
    // console.log(actualEntries[0]); 
    // console.log(actualEntries[1]); 
    // console.log(actualEntries[2]); 
    // console.log(actualEntries[3]); 
    // console.log(actualEntries[4]); 
    // console.log(actualEntries[5]); 
    // console.log(actualEntries[6]); 
    // console.log(actualEntries[7]); 
    // console.log(actualEntries[8]); 
    // console.log(actualEntries[9]); 
    // console.log(actualEntries[10]); 
    // console.log(actualEntries[11]); 
    //output.peekEntries().map(e => `[${e.spanId}]${e.token}:${e.messageId||''}`))

    console.log('end-of-test');

    expect(actualEntries).toMatchObject([
      '[1]StartSpan:S1',
      '[1]Log:E1',
      '[2]StartSpan:S2',
      '[2]Log:E2',
      '[2]Log:async-then',
      '[2]Log:E3',
      '[1]Log:async-then',
      '[1]Log:E4',
    ]);
  });

  it('flows scope across multiple nested awaits', async () => {
    const { input, output } = createCodePath();

    input.spanChild('R');
    input.logEvent('E1');

    const task2 = async () => {
      input.spanChild('S2');
      input.logEvent('E3');
      await delay(10);
      input.logEvent('E4');
    };

    const task1 = async () => {
      input.spanChild('S1');
      input.logEvent('E2');
      await task2();
      input.logEvent('E5');
    };

    await task1();

    input.logEvent('E6');

    const actualEntries = toAssertableEntryStrings(output);

    expect(actualEntries).toMatchObject([
      '[1]StartSpan:R',
      '[1]Log:E1',
      '[2]StartSpan:S1',
      '[2]Log:E2',
      '[3]StartSpan:S2',
      '[3]Log:E3',
      '[3]Log:async-then',
      '[3]Log:E4',
      '[2]Log:async-then',
      '[2]Log:E5',
      '[1]Log:async-then',
      '[1]Log:E6',
    ]);
  });

  it('flows scope across multiple parallel tasks', async () => {
    const { input, output } = createCodePath();

    input.spanChild('R');
    input.logEvent('R1');

    const task1 = async () => {
      input.spanChild('S1');
      input.logEvent('E11');
      await delay(100);
      input.logEvent('E12');
    };

    const task2 = async () => {
      input.spanChild('S2');
      input.logEvent('E21');
      await delay(10);
      input.logEvent('E22');
    };

    const task1Promise = task1();
    const task2Promise = task2();

    await task1Promise;
    await task2Promise;

    input.logEvent('R2');

    const actualEntries = toAssertableEntryStrings(output);

    expect(actualEntries).toMatchObject([
      '[1]StartSpan:R',
      '[1]Log:R1',
      '[2]StartSpan:S1',
      '[2]Log:E11',
      '[3]StartSpan:S2',
      '[3]Log:E21',
      '[3]Log:async-then',
      '[3]Log:E22',
      '[2]Log:async-then',
      '[2]Log:E12',
      '[1]Log:async-then',
      '[1]Log:async-then',
      '[1]Log:R2',
    ]);
  });

  it('flows scope across multiple parallel tasks with Promise.all', async () => {
    const { input, output } = createCodePath();

    input.spanChild('R');
    input.logEvent('R1');

    const task1 = async () => {
      setDebugCurrentStep('TASK1-ENTER');
      input.spanChild('S1');
      input.logEvent('E11');
      setDebugCurrentStep('TASK1-BEFORE-AWAIT');
      await delay(100);
      setDebugCurrentStep('TASK1-AFTER-AWAIT');
      input.logEvent('E12');
      setDebugCurrentStep('TASK1-EXIT');
    };

    const task2 = async () => {
      setDebugCurrentStep('TASK2-ENTER');
      input.spanChild('S2');
      input.logEvent('E21');
      setDebugCurrentStep('TASK2-BEFORE-AWAIT');
      await delay(10);
      setDebugCurrentStep('TASK2-AFTER-AWAIT');
      input.logEvent('E22');
      setDebugCurrentStep('TASK2-EXIT');
    };

  
    setDebugCurrentStep('ROOT-BEFORE-CREATE-PROMISES-ARRAY');

    const promisesArray = [
      task1(),
      task2()
    ];

    setDebugCurrentStep('ROOT-BEFORE-PROMISE-ALL');

    await Promise.all(promisesArray);

    setDebugCurrentStep('ROOT-AFTER-PROMISE-ALL');

    input.logEvent('R2');

    const debugLifecycle = getDebugPromiseLifecycle();

    const actualEntries = toAssertableEntryStrings(output, { excludeAsync: true });

    expect(actualEntries).toMatchObject([
      '[1]StartSpan:R',
      '[1]Log:R1',
      '[2]StartSpan:S1',
      '[2]Log:E11',
      '[3]StartSpan:S2',
      '[3]Log:E21',
      '[3]Log:E22',
      '[2]Log:E12',
      '[1]Log:R2',
    ]);
  });

  it('flows scope across await 2', async () => {
    const { input, output } = createCodePath();

    input.spanChild('S1');

    console.log('---A---');

    const p1 = delay(200);
    
    console.log('---A1---');
   
    const f1 = () => {
      console.log('---B---');
      input.spanChild('S2').finish();
    };

    console.log('---A2---');

    p1.then(f1);

    console.log('---C---');
    const p2 = delay(100);
    console.log('---C1---');

    await p2;

    console.log('---D---');

    await p1;
    console.log('---E---');

    input.logEvent('E1');

    const actualEntries = output.peekEntries()
      .filter(e => e.token !== 'StartTracer' && e.messageId !== 'async-then')
      .map(e => `[${e.spanId}]${e.token}:${e.messageId||''}`);
    console.log(actualEntries.length); 
    console.log(actualEntries[0]); 
    console.log(actualEntries[1]); 
    console.log(actualEntries[2]); 
    console.log(actualEntries[3]); 
    //output.peekEntries().map(e => `[${e.spanId}]${e.token}:${e.messageId||''}`))

    expect(actualEntries).toMatchObject([
      '[1]StartSpan:S1',
      '[2]StartSpan:S2',
      '[2]EndSpan:',
      '[1]Log:E1'
    ]);
  })

  it('flows scope inside async functions', async () => {
    const { input, output } = createCodePath();

    const asyncTask = async () => {
      input.spanChild('ATS1');
      await delay(10);
      input.logEvent('ATE1');
      input.finishSpan();
    }

    input.spanChild('S1');
    
    const asyncTaskPromise = asyncTask();
    
    input.spanChild('S2');

    await asyncTaskPromise;

    input.logEvent('E1');

    expect(output.peekEntries()).toMatchObject([
      { token: 'StartTracer' },
      { token: 'StartSpan', spanId: 1, messageId: 'S1' },
      { token: 'StartSpan', spanId: 2, messageId: 'ATS1', childOf: { spanId: 1 } },
      { token: 'StartSpan', spanId: 3, messageId: 'S2', childOf: { spanId: 1 } },
      { token: 'Log', messageId: 'async-then', spanId: 2 },
      { token: 'Log', spanId: 2, messageId: 'ATE1' },
      { token: 'EndSpan', spanId: 2 },
      { token: 'Log', messageId: 'async-then', spanId: 2 },
      { token: 'Log', messageId: 'async-then', spanId: 3 },
      { token: 'Log', spanId: 3, messageId: 'E1' },
    ]);
  });

  it('flows scope to promise then', async () => {
    const scopeManager = createDefaultScopeManager(createAsyncLocalProvider());
    const { input, output } = createCodePath({ scopeManager });

    const asyncTaskOne = async () => {
      input.spanChild('AT1-S1');
      await delay(100);
      input.logEvent('AT1-E1');
      input.finishSpan();
      return 111;
    }

    const asyncTaskTwo = async () => {
      input.spanChild('AT2-S1');
      await delay(10);
      input.logEvent('AT2-E1');
      input.finishSpan();
      return 222;
    }
    
    input.spanChild('R0');

    const taskPromiseOne = asyncTaskOne().then(value => {
      input.spanChild('AT1-S2');
      input.logEvent('AT1-E2', {value});
      input.finishSpan();
      return value;
    });

    const taskPromiseTwo = asyncTaskTwo().then(value => {
      input.spanChild('AT2-S2');
      input.logEvent('AT2-E2', {value});
      input.finishSpan();
      return value;
    });

    const valueOne = await taskPromiseOne;
    const valueTwo = await taskPromiseTwo;

    input.logEvent('E1', {valueOne, valueTwo});

    input.finishSpan();

    expect(output.peekEntries()).toMatchObject([
      { token: 'StartTracer' },
      { token: 'StartSpan', spanId: 1, messageId: 'R0', },
      { token: 'StartSpan', spanId: 2, childOf: { spanId: 1 }, messageId: 'AT1-S1' },
      { token: 'StartSpan', spanId: 3, childOf: { spanId: 1 }, messageId: 'AT2-S1' },
      { token: 'Log', messageId: 'async-then', spanId: 3 },
      { token: 'Log', spanId: 3, messageId: 'AT2-E1' },
      { token: 'EndSpan', spanId: 3 },
      { token: 'Log', messageId: 'async-then', spanId: 3 },
      { token: 'StartSpan', spanId: 4, childOf: { spanId: 3 }, messageId: 'AT2-S2', },
      { token: 'Log', spanId: 4, messageId: 'AT2-E2', tags: { value: 222 } },
      { token: 'EndSpan', spanId: 4 },
      { token: 'Log', messageId: 'async-then', spanId: 2 },
      { token: 'Log', spanId: 2, messageId: 'AT1-E1' },
      { token: 'EndSpan', spanId: 2 },
      { token: 'Log', messageId: 'async-then', spanId: 2 },
      { token: 'StartSpan', spanId: 5, childOf: { spanId: 2 }, messageId: 'AT1-S2' },
      { token: 'Log', spanId: 5, messageId: 'AT1-E2', tags: { value: 111 } },
      { token: 'EndSpan', spanId: 5 },
      { token: 'Log', messageId: 'async-then', spanId: 1 },
      { token: 'Log', messageId: 'async-then', spanId: 1 },
      { token: 'Log', spanId: 1, messageId: 'E1', tags: { valueOne: 111, valueTwo: 222 } },
      { token: 'EndSpan', spanId: 1 }
    ]);
  });

  it('catches rejected promises', async () => {
    const { input, output } = createCodePath();

    input.spanRoot('R0');

    await delay(10).then(() => {
      throw new Error('TEST-REJECT');
    }).catch(err => {
      expect(err.message).toBe('TEST-REJECT');
    });

    input.logEvent('E1');

    const entries = output.peekEntries();

    expect(entries).toMatchObject([
      { token: 'StartTracer' },
      { token: 'StartSpan', messageId: 'R0' },
      { token: 'Log', messageId: 'async-catch', tags: { error: { message: 'TEST-REJECT' } } },
      { token: 'Log', spanId: 1 }
    ]);

    expect(typeof entries[2].tags.error.message).toBe('string');
    expect(typeof entries[2].tags.error.stack).toBe('string');
  });

});

