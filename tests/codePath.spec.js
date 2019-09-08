import { childOf, followsFrom } from 'opentracing';
import { createCodePath, createDefaultScopeManager } from '../src/index';

const createMockSpan = (traceId, spanId, spanOptions) => {
  const logs = [];
  let finishCount = 0;
  return {
    context() {
      return {
        traceId,
        spanId
      };
    },
    log(message) {
      logs.push(message);
    },
    finish() {
      finishCount++;
    },
    testOptions() {
      return spanOptions;
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

const createTestClock = () => {
  let time = 0;
  return {
    now() {
      return time;
    },
    testSetTime(newTime) {
      time = newTime;
    }
  };
};

const setupCodePath = () => {
  let nextTraceId = 11;
  const tracers = [];
  const spans = [];
  const clock = createTestClock();
  const scopeManager = createDefaultScopeManager();
  const codePath = createCodePath({
    clock,
    tracerFactory: (options) => {
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
    codePath
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
    expect(span.context()).toMatchObject({traceId: 'T#11', spanId: 'S#1001'});
    expect(span.testOptions().tags).toMatchObject({
      id: 'ROOT-1',
      abc: 123
    });

    const spanOptions = span.testOptions();
    expect(spanOptions.childOf).toBeUndefined();
    expect(spanOptions.references).toBeUndefined();
  });

  it("can create child span of current active span", () => {
    const { tracers, spans, codePath } = setupCodePath();
    const parentSpan = codePath.spanChild('PARENT', { abc: 123 });
    
    const childSpan = codePath.spanChild('CHILD', { def: 456 });

    expect(tracers.length).toBe(1);
    expect(spans.length).toBe(2);
    expect(spans[1]).toBe(childSpan);

    expect(childSpan.context()).toMatchObject({
      traceId: 'T#11', 
      spanId: 'S#1002'
    });
    expect(childSpan.testOptions()).toMatchObject({
      references: [
        childOf({ traceId: 'T#11', spanId: 'S#1001' })
      ],
      tags: {
        id: 'CHILD',
        def: 456
      }
    });
  });

  it("resets active span to parent of span that finished", () => {
    const { tracers, spans, codePath, scopeManager } = setupCodePath();
    const parentSpan = codePath.spanChild('PARENT', { abc: 123 });

    expect(scopeManager.getActiveSpan()).toBe(parentSpan);

    const childSpan = codePath.spanChild('CHILD', { def: 456 });

    expect(scopeManager.getActiveSpan()).toBe(childSpan);

    codePath.finishSpan();

    expect(scopeManager.getActiveSpan()).toBe(parentSpan);
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
      { id: 'E1', str: 'def' }
    ]);
    expect(parentSpan.testLogs()).toMatchObject([
      { id: 'E0', str: 'abc' },
      { id: 'E2', str: 'ghi' }
    ]);
  });

});
