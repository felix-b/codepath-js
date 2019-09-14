import { createCodePathModel } from '../src';
import { createTreeGridController } from '../devtools/treeGrid';

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

});