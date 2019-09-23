import { childOf, followsFrom } from 'opentracing';
import { 
  createCodePath, 
  createDefaultScopeManager, 
  resetCurrentScope,
  contextToPlain, 
  plainToContext 
} from '../src/index';
import { createTestClock } from './testClock';

const referenceToPlain = (reference) => {
  if (reference) {
    return {
      type: reference.type(),
      referencedContext: contextToPlain(reference.referencedContext())
    };
  }
}

const createMockSpan = (traceId, spanId, spanOptions) => {
  const logs = [];
  let finishCount = 0;
  return {
    context() {
      return {
        toTraceId: () => traceId,
        toSpanId: () => spanId
      };
    },
    log(message) {
      logs.push(message);
    },
    finish() {
      finishCount++;
    },
    testOptions() {
      return {
        ...spanOptions,
        references: spanOptions.references 
          ? spanOptions.references.map(referenceToPlain)
          : undefined
      };
    },
    testLogs() {
      return logs;
    },
    testFinishCount() {
      return finishCount;
    }
  };
};

const createMockTracer = (traceId, options, spans) => {
  let nextSpanId = 1001;
  return {
    startSpan(id, options) {
      const newSpan = createMockSpan(traceId, `S#${nextSpanId++}`, {
        ...options,
        tags: {
          ...((options && options.tags) || {}),
          id
        }
      });
      spans.push(newSpan);
      return newSpan;
    },
    testGetOptions() {
      return options;
    }
  };
};

const setupCodePath = () => {
  resetCurrentScope();

  let nextTraceId = 11;
  const tracers = [];
  const spans = [];
  const clock = createTestClock();
  const scopeManager = createDefaultScopeManager();
  const { input, output } = createCodePath({
    clock,
    tracerFactory: (stream, options) => {
      const newTracer = createMockTracer(`T#${nextTraceId++}`, options, spans);
      tracers.push(newTracer);
      return newTracer;
    },
    scopeManager
  });

  return {
    clock,
    scopeManager,
    tracers,
    spans,
    codePath: input
  };
}

describe("createCodePath", () => {

  it("setup without crashing", () => {
    const { clock, tracers, spans, codePath } = setupCodePath();

    expect(clock).toBeDefined();
    expect(tracers.length).toBe(1);
    expect(spans.length).toBe(0);
    expect(codePath).toBeDefined();
  });

  it("can create root span", () => {
    const { tracers, spans, codePath } = setupCodePath();
    
    const span = codePath.spanChild('ROOT-1', { abc: 123 });

    expect(tracers.length).toBe(1);
    expect(spans.length).toBe(1);
    expect(spans[0]).toBe(span);
    expect(contextToPlain(span.context())).toMatchObject({traceId: 'T#11', spanId: 'S#1001'});
    expect(span.testOptions().tags).toMatchObject({
      id: 'ROOT-1',
      abc: 123
    });

    const spanOptions = span.testOptions();
    expect(spanOptions.childOf).toBeUndefined();
    expect(spanOptions.references).toBeUndefined();
  });

  it("can create root span over current one", () => {
    const { tracers, spans, codePath, scopeManager } = setupCodePath();

    codePath.spanRoot('ROOT-1', { abc: 123 });
    const root2 = codePath.spanRoot('ROOT-2', { abc: 456 });

    expect(scopeManager.getActiveSpan()).toBe(root2);
    expect(root2.testOptions().references).toBeUndefined();
    expect(root2.testOptions().tags).toMatchObject({
      id: 'ROOT-2',
      abc: 456
    });
  });

  it("can create child span of current active span", () => {
    const { tracers, spans, codePath } = setupCodePath();
    const parentSpan = codePath.spanChild('PARENT', { abc: 123 });
    
    const childSpan = codePath.spanChild('CHILD', { def: 456 });

    expect(tracers.length).toBe(1);
    expect(spans.length).toBe(2);
    expect(spans[1]).toBe(childSpan);

    expect(contextToPlain(childSpan.context())).toMatchObject({
      traceId: 'T#11', 
      spanId: 'S#1002'
    });
    expect(childSpan.testOptions()).toMatchObject({
      references: [
        referenceToPlain(childOf(plainToContext({ traceId: 'T#11', spanId: 'S#1001' })))
      ],
      tags: {
        id: 'CHILD',
        def: 456
      }
    });
  });

  it("resets active span to parent of nested span that finished", () => {
    const { tracers, spans, codePath, scopeManager } = setupCodePath();
    const parentSpan = codePath.spanChild('PARENT', { abc: 123 });

    expect(scopeManager.getActiveSpan()).toBe(parentSpan);

    codePath.logDebug('HEAD');

    const childSpan = codePath.spanChild('CHILD', { def: 456 });

    expect(scopeManager.getActiveSpan()).toBe(childSpan);

    codePath.logDebug('MIDDLE');

    codePath.finishSpan();

    expect(scopeManager.getActiveSpan()).toBe(parentSpan);

    codePath.logDebug('TAIL');

    expect(spans.length).toBe(2);
    expect(spans[0].testLogs().map(log => log.$id)).toEqual(['HEAD', 'TAIL']);
    expect(spans[1].testLogs().map(log => log.$id)).toEqual(['MIDDLE']);
  });

  it("resets active span to undefined when root span is finished", () => {
    const { codePath, scopeManager } = setupCodePath();
    
    expect(scopeManager.getActiveSpan()).toBeUndefined();
    
    const parentSpan = codePath.spanChild('PARENT');

    expect(scopeManager.getActiveSpan()).toBe(parentSpan);

    codePath.finishSpan();

    expect(scopeManager.getActiveSpan()).toBeUndefined();
  });

  it("adds logs to active span", () => {
    const { tracers, spans, codePath, scopeManager } = setupCodePath();
    const parentSpan = codePath.spanChild('PARENT', { abc: 123 });

    codePath.logEvent('E0', { str: 'abc' });

    const childSpan = codePath.spanChild('CHILD', { def: 456 });

    codePath.logEvent('E1', { str: 'def' });

    codePath.finishSpan();

    codePath.logEvent('E2', { str: 'ghi' });

    expect(childSpan.testLogs()).toMatchObject([
      { $id: 'E1', str: 'def' }
    ]);
    expect(parentSpan.testLogs()).toMatchObject([
      { $id: 'E0', str: 'abc' },
      { $id: 'E2', str: 'ghi' }
    ]);
  });

});
