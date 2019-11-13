import { 
  createCodePath,
  createDefaultScopeManager, 
  createAsyncLocalProvider,
  resetCurrentScope,
  restoreOriginalPromise,
} from '../src/index';
import { CustomConsole } from '@jest/console';

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
  setTimeout(() => resolve(`delay(${ms})`), ms);
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

  it('flows scope across await', async () => {
    const { input, output } = createCodePath();

    input.spanChild('S1');

    console.log('---A---');

    const p1 = delay(200);
    
    console.log('---A1---');
   
    const f1 = () => {
      console.log('---B---');
      input.spanChild('S2');
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

    console.log(output.peekEntries().map(e => `[${e.spanId}]${e.token}:${e.messageId||''}`))

    expect(output.peekEntries()).toMatchObject([
      { token: 'StartTracer' },
      { token: 'StartSpan', spanId: 1 },
      { token: 'StartSpan', spanId: 2, childOf: { spanId: 1 } },
      { token: 'Log', messageId: 'async-then', spanId: 1 },
      { token: 'Log', spanId: 1 }
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
  })

});

