import { 
  createCodePath,
  createDefaultScopeManager, 
  resetCurrentScope,
  trace
} from '../src/index';

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

describe('DefaultScopeManager', () => {

  beforeEach(() => {
    resetCurrentScope();
  });

  it('flows scope across await', async () => {
    const { input, output } = createCodePath();

    input.spanChild('S1');

    delay(10).then(() => {
      input.spanChild('S2');
    });

    await trace(delay(100));

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
      await trace(delay(10));
      input.logEvent('ATE1');
      input.finishSpan();
    }

    input.spanChild('S1');
    
    const asyncTaskPromise = trace(() => asyncTask());
    
    input.spanChild('S2');

    await trace(asyncTaskPromise);

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
    const scopeManager = createDefaultScopeManager();
    const { input, output } = createCodePath({ scopeManager });

    const asyncTaskOne = async () => {
      input.spanChild('AT1-S1');
      await trace(delay(100));
      input.logEvent('AT1-E1');
      input.finishSpan();
      return 111;
    }

    const asyncTaskTwo = async () => {
      input.spanChild('AT2-S1');
      await trace(delay(10));
      input.logEvent('AT2-E1');
      input.finishSpan();
      return 222;
    }
    
    input.spanChild('R0');

    const taskPromiseOne = trace(() => asyncTaskOne()).then(value => {
      input.spanChild('AT1-S2');
      input.logEvent('AT1-E2', {value});
      input.finishSpan();
      return value;
    });

    const taskPromiseTwo = trace(() => asyncTaskTwo()).then(value => {
      input.spanChild('AT2-S2');
      input.logEvent('AT2-E2', {value});
      input.finishSpan();
      return value;
    });

    const valueOne = await trace(taskPromiseOne);
    const valueTwo = await trace(taskPromiseTwo);

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

});

