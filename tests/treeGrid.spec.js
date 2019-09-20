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
    view.updateNode.mockClear();
    view.attachController.mockClear();
    view.clearAll.mockClear();
  };

  const setupMvc = (populateInitialModel) => {
    model = createCodePathModel();
    populateInitialModel && populateInitialModel(model);
    view = {
      attachController: jest.fn(),
      insertNodes: jest.fn(),
      removeNodes: jest.fn(),
      updateNode: jest.fn(),
      clearAll: jest.fn(),
    };
    controller = createTreeGridController(view, model);
  };
  
  beforeEach(() => {
    setupMvc();
  });

  it('is initially empty for empty model', () => {
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
      { token: 'Log', messageId: 789, traceId: 'T1', spanId: 102 },
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

  it('initially displays root spans of non-empty model', () => {
    const initialEntries = [
      { token: 'StartSpan', messageId: 'S1', traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 'M1', traceId: 'T1', spanId: 101 },
      { token: 'EndSpan', traceId: 'T1', spanId: 101 },
      { token: 'StartSpan', messageId: 'S2', traceId: 'T1', spanId: 102 },
      { token: 'Log', messageId: 'M2', traceId: 'T1', spanId: 102 },
      { token: 'EndSpan', traceId: 'T1', spanId: 102 },
      { token: 'StartSpan', messageId: 'S3', traceId: 'T1', spanId: 103 },
      { token: 'Log', messageId: 'M3', traceId: 'T1', spanId: 103 },
      { token: 'EndSpan', traceId: 'T1', spanId: 103 },
    ];

    setupMvc(() => {
      model.publish(initialEntries);
    });

    expectCalls(view.insertNodes, 
      [0, [{ entry: { messageId: 'S1' } }]],
      [1, [{ entry: { messageId: 'S2' } }]],
      [2, [{ entry: { messageId: 'S3' } }]]
    );

    expect(view.removeNodes).not.toBeCalled();
  });

  it('can replace model', () => {
    const initialEntries = [
      { token: 'StartSpan', messageId: 'S1', traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 'M1', traceId: 'T1', spanId: 101 },
      { token: 'Log', messageId: 'M2', traceId: 'T1', spanId: 101 },
    ];
    const newEntries = [
      { token: 'StartSpan', messageId: 'S21', traceId: 'T2', spanId: 201 },
      { token: 'Log', messageId: 'M21', traceId: 'T2', spanId: 201 },
      { token: 'Log', messageId: 'M22', traceId: 'T2', spanId: 201 },
      { token: 'Log', messageId: 'M23', traceId: 'T2', spanId: 201 },
    ];

    model.publish(initialEntries);
    controller.expand(1);
    resetViewCalls();

    const newModel = createCodePathModel();
    newModel.publish(newEntries);

    controller.replaceModel(newModel);
    
    expectCalls(view.clearAll, []);
    expectCalls(view.insertNodes, 
      [0, [{ entry: { messageId: 'S21' } }]],
    );
    resetViewCalls();

    controller.expand(1);

    expectCalls(view.insertNodes, 
      [1, [
        { entry: { messageId: 'M21' } },
        { entry: { messageId: 'M22' } },
        { entry: { messageId: 'M23' } }
      ]],
    );
  });

});