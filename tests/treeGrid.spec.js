import { createCodePathModel } from '../src';
import { createTreeGridController } from '../src';

describe('TreeGridController', () => {

  let model = undefined;
  let view = undefined;
  let controller = undefined;

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

  const resetViewCalls = () => {
    view.insertNodes.mockClear();
    view.removeNodes.mockClear();
    view.attachController.mockClear();
  };

  beforeEach(() => {
    model = createCodePathModel();
    view = {
      attachController: jest.fn(),
      insertNodes: jest.fn(),
      removeNodes: jest.fn(),
    };
    controller = createTreeGridController(view, model);
  });

  it('is initially empty', () => {
    expect(view.insertNodes).not.toBeCalled();
    expect(view.removeNodes).not.toBeCalled();
  });

  it('can show first root span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
    ];

    model.publish(entries);

    expectCalls(view.insertNodes, 
      [0, [{ id: 1 }] ]
    );
  });

  it('can start second root span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 456, traceId: 'T1', spanId: 102 },
    ];

    model.publish(entries);

    expectCalls(view.insertNodes, 
      [0, [{ id: 1 }, { id: 2 }] ]
    );
  });

  it('can ignore invisible nested nodes', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 456, traceId: 'T1', spanId: 102, childOf: {
        traceId: 'T1', spanId: 101  
      } },
    ];

    model.publish(entries);

    expectCalls(view.insertNodes, 
      [0, [{ id: 1 }] ]
    );
  });

  it('can expand single root span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 124, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 125, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 126, traceId: 'T1', spanId: 101 },
    ];
    model.publish(entries);
    resetViewCalls();

    controller.expand(1);

    expectCalls(view.insertNodes, 
      [1, [
        { entry: { messageId: 124} },
        { entry: { messageId: 125} },
        { entry: { messageId: 126} },
      ] ]
    );
  });

  it('can show new subnodes under expanded span', () => {
    const initialEntries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 124, traceId: 'T1', spanId: 101 },
    ];
    const newEntries = [
      { token: 'Log', messageId: 125, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 126, traceId: 'T1', spanId: 101 },
    ];
    model.publish(initialEntries);
    controller.expand(1);
    resetViewCalls();

    model.publish(newEntries);

    expectCalls(view.insertNodes, 
      [2, [
        { entry: { messageId: 125} },
        { entry: { messageId: 126} },
      ] ]
    );
  });

  it('can collapse span', () => {
    const entries = [
      { token: 'StartSpan', messageId: 123, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 124, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 125, traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 126, traceId: 'T1', spanId: 101 },
    ];
    model.publish(entries);
    controller.expand(1);
    resetViewCalls();

    controller.collapse(1);

    expectCalls(view.removeNodes, 
      [1, 3]
    );
  });

});