import { createCodePathModel } from '../src';


describe('CodePathModel', () => {

  let model;
  let subscriber;

  const expectSubscriberCalls = (...invocationsToMatch) => {
    expect(subscriber).toHaveBeenCalledTimes(invocationsToMatch.length);

    for (let i = 0 ; i < invocationsToMatch.length ; i++) {
      const actualNode = subscriber.mock.calls[i][0];
      expect(actualNode).toMatchObject(invocationsToMatch[i]);
    }
  }
  
  beforeEach(() => {
    subscriber = jest.fn();
    model = createCodePathModel();
    model.subscribe(subscriber);
  });

  it('can start first root span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
    ];

    model.publish(entries);

    expectSubscriberCalls([
      { id: 1, entry: entries[0] }
    ]);
  });

  it('can start second root span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 456, traceId: 'T1', spanId: 102 },
    ];

    model.publish(entries);

    expectSubscriberCalls([
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[1] }
    ]);
  });

  it('can start nested span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 456, traceId: 'T1', spanId: 102, childOf: {
        traceId: 'T1', spanId: 101  
      } },
    ];

    model.publish(entries);

    expectSubscriberCalls([
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[1], parent: { id: 1 } }
    ]);
  });

  it('can record log under span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 456, traceId: 'T1', spanId: 101 },
    ];

    model.publish(entries);

    expectSubscriberCalls([
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[1], parent: { id: 1 } }
    ]);
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

    expectSubscriberCalls([
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[1], parent: { id: 1 } },
      { id: 3, entry: entries[2], parent: { id: 2 } }
    ]);
  });

  it('can finish root span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 456, traceId: 'T1', spanId: 101 },
      { token: 'EndSpan', traceId: 'T1', spanId: 101 },
    ];

    model.publish(entries);

    expectSubscriberCalls([
      { id: 1, entry: entries[0] },
      { id: 2, entry: entries[1], parent: { id: 1 } }
    ]);
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

    expectSubscriberCalls([
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
      },
      { 
        id: 3, 
        entry: { messageId: 'm3' }, 
      },
      { 
        id: 4, 
        entry: { messageId: 'm4' }, 
      },
      { 
        id: 5, 
        entry: { messageId: 'm5' }, 
      },
      { 
        id: 6, 
        entry: { messageId: 'm6' }, 
      },
    ]);
  });

});
