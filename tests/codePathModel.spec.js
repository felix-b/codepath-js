import { createCodePathModel } from '../src';

describe('CodePathModel', () => {

  let model;
  let subscriber;

  const expectCalls = (func, ...invocationsToMatch) => {
    expect(func).toHaveBeenCalledTimes(invocationsToMatch.length);

    for (let i = 0 ; i < invocationsToMatch.length ; i++) {
      const expectedCall = invocationsToMatch[i];
      const actualCall = func.mock.calls[i];

      for (let j = 0 ; j < expectedCall.length ; j++) {
        const expectedArgument = expectedCall[j];
        const actualArgument = actualCall[j];
        if (typeof(expectedArgument) === 'object') {
          expect(actualArgument).toMatchObject(expectedArgument);
        } else {
          expect(actualArgument).toBe(expectedArgument);
        }
      }

      expect(actualCall.length).toBe(expectedCall.length);
    }

    expect(func.mock.calls.length).toBe(invocationsToMatch.length);
  }

  const resetSubscriberCalls = () => {
    subscriber.insertNodes.mockClear();
    subscriber.updateNodes.mockClear();
  };

  const initWithTestModel = (newModel) => {
    model = newModel;
    subscriber = {
      insertNodes: jest.fn(),
      updateNodes: jest.fn()
    };
    model.subscribe(subscriber);
  };
  
  beforeEach(() => {
    initWithTestModel(createCodePathModel());
  });

  it('can start first root span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries[0] }
    ]]);
  });

  it('can start second root span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 456, traceId: 'T1', spanId: 102 },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[1] }
    ]]);
  });

  it('can start nested span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 456, traceId: 'T1', spanId: 102, childOf: {
        traceId: 'T1', spanId: 101  
      } },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[1], parent: { id: 1 } }
    ]]);
  });

  it('can record log under span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 456, traceId: 'T1', spanId: 101 },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[1], parent: { id: 1 } }
    ]]);
  });

  it('can record log under nested span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 456, traceId: 'T1', spanId: 102, childOf: {
        traceId: 'T1', spanId: 101
      } },
      { token: 'Log', messageId: 789, traceId: 'T1', spanId: 102 },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[1], parent: { id: 1 } },
      { id: 3, entry: entries[2], parent: { id: 2 } }
    ]]);
  });

  it('can finish root span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 456, traceId: 'T1', spanId: 101 },
      { token: 'EndSpan', traceId: 'T1', spanId: 101 },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[1], parent: { id: 1 } }
    ]]);
  });

  it('can structure nodes in a tree', () => {
    const entries = [
      { token: 'StartSpan', messageId: 'm1', traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 'm2', traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 'm3', traceId: 'T1', spanId: 102, childOf: {
        traceId: 'T1', spanId: 101
      } },
      { token: 'Log', messageId: 'm4', traceId: 'T1', spanId: 102 },
      { token: 'Log', messageId: 'm5', traceId: 'T1', spanId: 102 },
      { token: 'EndSpan', traceId: 'T1', spanId: 102 },
      { token: 'Log', messageId: 'm6', traceId: 'T1', spanId: 101 },
      { token: 'EndSpan', traceId: 'T1', spanId: 101 },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { 
        id: 1, 
        parent: { id: 0 },
        entry: { messageId: 'm1' }, 
        firstChild: { entry: { messageId: 'm2' } },
        lastChild: { entry: { messageId: 'm6' } },
        prevSibling: undefined,
        nextSibling: undefined,
      },
      { 
        id: 2, 
        entry: { messageId: 'm2' }, 
        parent: { id: 1 },
        firstChild: undefined,
        lastChild: undefined,
        prevSibling: undefined,
        nextSibling: { entry: { messageId: 'm3' } },
      },
      { 
        id: 3, 
        entry: { messageId: 'm3' }, 
        parent: { id: 1 },
        firstChild: { entry: { messageId: 'm4' } },
        lastChild: { entry: { messageId: 'm5' } },
        prevSibling: { entry: { messageId: 'm2' } },
        nextSibling: { entry: { messageId: 'm6' } },
      },
      { 
        id: 4, 
        entry: { messageId: 'm4' }, 
        parent: { id: 3 },
        firstChild: undefined,
        lastChild: undefined,
        prevSibling: undefined,
        nextSibling: { entry: { messageId: 'm5' } },
      },
      { 
        id: 5, 
        entry: { messageId: 'm5' }, 
        parent: { id: 3 },
        firstChild: undefined,
        lastChild: undefined,
        prevSibling: { entry: { messageId: 'm4' } },
        nextSibling: undefined,
      },
      { 
        id: 6, 
        entry: { messageId: 'm6' }, 
        parent: { id: 1 },
        firstChild: undefined,
        lastChild: undefined,
        prevSibling: { entry: { messageId: 'm3' } },
        nextSibling: undefined,
      },
    ]]);
  });

  it('can tolerate missing parent nodes', () => {
    const entries = [
      { token: 'Log', messageId: 'm4', traceId: 'T1', spanId: 102 },
      { token: 'Log', messageId: 'm5', traceId: 'T1', spanId: 102 },
      { token: 'EndSpan', traceId: 'T1', spanId: 102 },
      { token: 'Log', messageId: 'm6', traceId: 'T1', spanId: 101 },
      { token: 'EndSpan', traceId: 'T1', spanId: 101 },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { 
        id: 1, 
        entry: { messageId: 'm4' }, 
        parent: { id: 0 },
        firstChild: undefined,
        lastChild: undefined,
        prevSibling: undefined,
        nextSibling: { entry: { messageId: 'm5' } },
      },
      { 
        id: 2, 
        entry: { messageId: 'm5' }, 
        parent: { id: 0 },
        firstChild: undefined,
        lastChild: undefined,
        prevSibling: { entry: { messageId: 'm4' } },
        nextSibling: { entry: { messageId: 'm6' } },
      },
      { 
        id: 3, 
        entry: { messageId: 'm6' }, 
        parent: { id: 0 },
        firstChild: undefined,
        lastChild: undefined,
        prevSibling: { entry: { messageId: 'm5' } },
        nextSibling: undefined,
      },
    ]]);
  });

  it('can walk nodes depth-first', () => {
    const entries = [
      { token: 'StartSpan', messageId: 'S1', traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 'M11', traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 'S2', traceId: 'T1', spanId: 102, childOf: {
        traceId: 'T1', spanId: 101
      } },
      { token: 'Log', messageId: 'M21', traceId: 'T1', spanId: 102 },
      { token: 'StartSpan', messageId: 'S3', traceId: 'T1', spanId: 103, childOf: {
        traceId: 'T1', spanId: 102
      } },
      { token: 'Log', messageId: 'M31', traceId: 'T1', spanId: 103 },
      { token: 'Log', messageId: 'M32', traceId: 'T1', spanId: 103 },
      { token: 'EndSpan', traceId: 'T1', spanId: 103 },
      { token: 'Log', messageId: 'M22', traceId: 'T1', spanId: 102 },
      { token: 'EndSpan', traceId: 'T1', spanId: 102 },
      { token: 'Log', messageId: 'M12', traceId: 'T1', spanId: 101 },
      { token: 'EndSpan', traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 'S4', traceId: 'T1', spanId: 104 },
    ];
    model.publish(entries);
    const walkList = [];

    model.walkNodesDepthFirst(node => walkList.push(node.entry.messageId));

    expect(walkList).toEqual([
      'S1','M11','S2','M21','S3','M31','M32','M22','M12','S4'
    ]);
  });

  it('can update duration on span finish', () => {
    const entries = [
      { time: 100, token: 'StartSpan', messageId: 'S1', traceId: 'T1', spanId: 101 },
      { time: 200, token: 'Log', messageId: 'M1', traceId: 'T1', spanId: 101 },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: {...entries[0] } },
      { id: 2, entry: entries[1], parent: { id: 1 } }
    ]]);
    expect(subscriber.updateNodes).not.toBeCalled();

    resetSubscriberCalls();

    model.publish([
      { time: 350, token: 'EndSpan', traceId: 'T1', spanId: 101 },
    ]);

    expect(subscriber.insertNodes).not.toBeCalled();
    expectCalls(subscriber.updateNodes, [[
      { id: 1, entry: {...entries[0], duration: 250 } },
    ]]);

  });

  it('can aggregate metrics inside span', () => {
    const entries = [
      { time: 100, token: 'StartSpan', messageId: 'S1', traceId: 'T1', spanId: 101, metrics: { z: 30 } },
      { time: 200, token: 'Log', messageId: 'M1', traceId: 'T1', spanId: 101, metrics: { x: 10, y: 20 } },
      { time: 300, token: 'Log', messageId: 'M2', traceId: 'T1', spanId: 101, metrics: { y: 2, z: 3 } },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries[0], metrics: { x: 10, y: 22, z: 33 } },
      { id: 2, entry: entries[1], metrics: { x: 10, y: 20 } },
      { id: 3, entry: entries[2], metrics: { y: 2, z: 3 } }
    ]]);

  });

  it('can aggregate metrics inside span', () => {
    const entries = [
      { time: 100, token: 'StartSpan', messageId: 'S1', traceId: 'T1', spanId: 101, metrics: { z: 30 } },
      { time: 200, token: 'Log', messageId: 'M1', traceId: 'T1', spanId: 101, metrics: { x: 10, y: 20 } },
      { time: 300, token: 'Log', messageId: 'M2', traceId: 'T1', spanId: 101, metrics: { y: 2, z: 3 } },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries[0], metrics: { x: 10, y: 22, z: 33 } },
      { id: 2, entry: entries[1], metrics: { x: 10, y: 20 } },
      { id: 3, entry: entries[2], metrics: { y: 2, z: 3 } }
    ]]);

  });

  it('can aggregate metrics upon later insertion of subnode', () => {
    const entries0 = [
      { time: 100, token: 'StartSpan', messageId: 'S1', traceId: 'T1', spanId: 101, metrics: { z: 30 } },
      { time: 200, token: 'Log', messageId: 'M1', traceId: 'T1', spanId: 101, metrics: { x: 10, y: 20 } },
    ];
    const entries1 = [
      { time: 300, token: 'Log', messageId: 'M2', traceId: 'T1', spanId: 101, metrics: { y: 2, z: 3 } },
    ];

    model.publish(entries0);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries0[0], metrics: { x: 10, y: 20, z: 30 } },
      { id: 2, entry: entries0[1], metrics: { x: 10, y: 20 } },
      //{ id: 3, entry: entries[2], metrics: { y: 2, z: 3 } }
    ]]);
    expect(subscriber.updateNodes).not.toBeCalled();

    resetSubscriberCalls();

    model.publish(entries1);

    expectCalls(subscriber.insertNodes, [[
      { id: 3, entry: entries1[0], metrics: { y: 2, z: 3 } }
    ]]);
    expectCalls(subscriber.updateNodes, [[
      { id: 1, entry: entries0[0], metrics: { x: 10, y: 22, z: 33 } },
    ]]);

  });

  it('can bubble metrics to root', () => {
    const entries0 = [
      { time: 100, token: 'StartSpan', messageId: 'S1', traceId: 'T1', spanId: 101 },
      { time: 200, token: 'StartSpan', messageId: 'S2', traceId: 'T1', spanId: 102, childOf: {
        traceId: 'T1', spanId: 101
      } },
      { time: 300, token: 'StartSpan', messageId: 'S3', traceId: 'T1', spanId: 103, metrics: { x: 1 }, childOf: {
        traceId: 'T1', spanId: 102
      } },
      { time: 400, token: 'Log', messageId: 'M1', traceId: 'T1', spanId: 103, metrics: { x: 10 } },
    ];
    const entries1 = [
      { time: 500, token: 'Log', messageId: 'M2', traceId: 'T1', spanId: 103, metrics: { x: 20 } },
    ];
    const entries2 = [
      { time: 777, token: 'EndSpan', traceId: 'T1', spanId: 103 },
    ];

    model.publish(entries0);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries0[0], metrics: { x: 11 } },
      { id: 2, entry: entries0[1], metrics: { x: 11 } },
      { id: 3, entry: entries0[2], metrics: { x: 11 } },
      { id: 4, entry: entries0[3], metrics: { x: 10 } },
    ]]);
    expect(subscriber.updateNodes).not.toBeCalled();

    resetSubscriberCalls();
    model.publish(entries1);

    expectCalls(subscriber.insertNodes, [[
      { id: 5, entry: entries1[0], metrics: { x: 20 } }
    ]]);
    expectCalls(subscriber.updateNodes, [[
      { id: 3, entry: entries0[2], metrics: { x: 31 } },
      { id: 2, entry: entries0[1], metrics: { x: 31 } },
      { id: 1, entry: entries0[0], metrics: { x: 31 } },
    ]]);

    resetSubscriberCalls();
    model.publish(entries2);

    expect(subscriber.insertNodes).not.toBeCalled();
    expectCalls(subscriber.updateNodes, [[
      { id: 3, entry: entries0[2], metrics: { x: 31 } },
    ]]);
  });

  it('can include reference to top span node', () => {
    const entries = [
      { token: 'StartSpan', messageId: 'm1', traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 'm2', traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 'm3', traceId: 'T1', spanId: 102, childOf: {
        traceId: 'T1', spanId: 101
      } },
      { token: 'Log', messageId: 'm4', traceId: 'T1', spanId: 102 },
      { token: 'EndSpan', traceId: 'T1', spanId: 102 },
      { token: 'Log', messageId: 'm5', traceId: 'T1', spanId: 101 },
      { token: 'EndSpan', traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 'm6', traceId: 'T1', spanId: 103 },
      { token: 'Log', messageId: 'm7', traceId: 'T1', spanId: 103 },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { 
        id: 1,
        entry: { messageId: 'm1' }, 
        top: { id: 1 }
      },
      { 
        entry: { messageId: 'm2' }, 
        top: { id: 1 }
      },
      { 
        entry: { messageId: 'm3' }, 
        top: { id: 1 }
      },
      { 
        entry: { messageId: 'm4' }, 
        top: { id: 1 }
      },
      { 
        entry: { messageId: 'm5' }, 
        top: { id: 1 }
      },
      { 
        id: 6,
        entry: { messageId: 'm6' }, 
        top: { id: 6 }
      },
      { 
        entry: { messageId: 'm7' }, 
        top: { id: 6 }
      },
    ]]);
  });

  it('can specify metrics extractor function', () => {
    initWithTestModel(
      createCodePathModel({ 
        extractEntryMetrics: entry => {
          return {
            bar: entry.foo
          }
        }
      })
    );

    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101, foo: 11 },
      { token: 'StartSpan', messageId: 456, traceId: 'T1', spanId: 102, foo: 22, childOf: {
        traceId: 'T1', spanId: 101
      } },
      { token: 'Log', messageId: 789, traceId: 'T1', spanId: 102, foo: 33 },
    ];

    model.publish(entries);

    expectCalls(subscriber.insertNodes, [[
      { id: 1, entry: entries[0], metrics: { bar: 66 } },
      { id: 2, entry: entries[1], parent: { id: 1 }, metrics: { bar: 55 } },
      { id: 3, entry: entries[2], parent: { id: 2 }, metrics: { bar: 33 } }
    ]]);
  });

});
