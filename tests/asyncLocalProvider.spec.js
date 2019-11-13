import { restoreOriginalPromise, createAsyncLocalProvider } from "../src/asyncLocalProvider";
import { promises } from "dns";

const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

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

  it('can flow locals over await', async () => {
    const provider = createAsyncLocalProvider();
    const local = provider.createAsyncLocal('A1');
    let log = {};

    log['init'] = local.get();
    local.set('A2');

    const asyncTask1 = async () => {
      log['async-task-1-start'] = local.get();
      local.set('B1');

      await delay(10);

      log['async-task-1-after-await'] = local.get();
      local.set('B2');
    };

    const asyncTask2 = async () => {
      log['async-task-2-start'] = local.get();
      local.set('C1');

      await delay(100);

      log['async-task-2-after-await'] = local.get();
      local.set('C2');
    };

    log['before-async-tasks'] = local.get();

    await Promise.all([
      asyncTask1(), 
      asyncTask2()
    ]);

    log['after-async-tasks'] = local.get();

    expect(log).toMatchObject({
      'init': 'A1',
      'before-async-tasks': 'A2',
      'async-task-1-start': 'A2',
      'async-task-1-after-await': 'B1',
      'async-task-2-start': 'A2',
      'async-task-2-after-await': 'C1',
      'after-async-tasks': 'A2',
    });
  });

});