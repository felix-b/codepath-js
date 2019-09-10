import { createCodePathTracer } from '../src';

const createClock = (initialTime = 0) => {
  let time = initialTime;
  return {
    now() {
      return time;
    },
    setTime(newTime) {
      time = newTime;
    }
  }
}

describe('CodePathTracer', () => {

  it('can start root span', () => {
    const tracer = createCodePathTracer('T#1', {
      clock: createClock(123)
    });

    const span = tracer.startSpan('R#1');

    expect(span.getData()).toMatchObject({
      context: {
        traceId: 'T#1',
        spanId: 1
      },
      childOf: undefined,
      followsFrom: undefined,
      operationName: 'R#1',
      startTime: 123,
      endTime: undefined,
      tags: {},
      logs: []
    });
  });

  it('can end root span', () => {
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', { clock });
    const span = tracer.startSpan('R#1');
    clock.setTime(456);

    span.finish();

    expect(span.getData()).toMatchObject({
      startTime: 123,
      endTime: 456,
    });
  });

  it('can start child span', () => {
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', {clock});
    const rootSpan = tracer.startSpan('R#1');
    clock.setTime(456);
    
    const childSpan = tracer.startSpan('S#11', {
      childOf: rootSpan
    });

    expect(childSpan.getData()).toMatchObject({
      context: {
        traceId: 'T#1',
        spanId: 2
      },
      childOf: {
        traceId: 'T#1',
        spanId: 1
      },
      operationName: 'S#11',
      startTime: 456,
      endTime: undefined,
      tags: {},
      logs: []
    });
  });

  it('can end child span', () => {
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', {clock});
    const rootSpan = tracer.startSpan('R#1');
    clock.setTime(456);
    const childSpan = tracer.startSpan('S#11', {
      childOf: rootSpan
    });
    clock.setTime(789);

    childSpan.finish();

    expect(childSpan.getData()).toMatchObject({
      startTime: 456,
      endTime: 789,
    });

    expect(rootSpan.getData()).toMatchObject({
      startTime: 123,
      endTime: undefined,
    });
  });

  it('can start span with tags', () => {
    const tracer = createCodePathTracer('T#1', {
      clock: createClock(123)
    });

    const span = tracer.startSpan('S#1', {
      tags: { k1: 'v1', k2: 'v2' }
    });

    expect(span.getData()).toMatchObject({
      tags: {
        k1: 'v1',
        k2: 'v2'
      }
    });
  });

  it('can add tags to span', () => {
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', { clock });
    const span = tracer.startSpan('S#1', {
      tags: { k1: 'v1', k2: 'v2' }
    });
    clock.setTime(456);

    span.addTags({ k2: 'U2', k3: 'v3' });

    expect(span.getData()).toMatchObject({
      tags: {
        k1: 'v1',
        k2: 'U2',
        k3: 'v3'
      }
    });
  });

  it('can start span with specific time', () => {
    const tracer = createCodePathTracer('T#1', {
      clock: createClock(123)
    });

    const span = tracer.startSpan('S#1', {
      startTime: 456
    });

    expect(span.getData()).toMatchObject({
      startTime: 456
    });
  });

  it('can end span with specific time', () => {
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', { clock });
    const span = tracer.startSpan('S#1');
    clock.setTime(456);

    span.finish(789);

    expect(span.getData()).toMatchObject({
      endTime: 789
    });
  });

  it('can add log with current time', () => {
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', { clock });
    const span = tracer.startSpan('S#1');
    clock.setTime(456);

    span.log({ k1: 'v1', k2: 'v2' });

    expect(span.getData()).toMatchObject({
      logs: [
        { $time: 456, k1: 'v1', k2: 'v2' }
      ]
    });
  });

  it('can add log with specific time', () => {
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', { clock });
    const span = tracer.startSpan('S#1');
    clock.setTime(456);

    span.log({ k1: 'v1', k2: 'v2' }, 789);

    expect(span.getData()).toMatchObject({
      logs: [
        { $time: 789, k1: 'v1', k2: 'v2' }
      ]
    });
  });

  it('can add multiple logs', () => {
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', { clock });
    const span = tracer.startSpan('S#1');

    clock.setTime(456);
    span.log({ id: 'm1', k1: 'v11'});

    clock.setTime(457);
    span.log({ id: 'm2', k2: 'v22'});
    
    clock.setTime(458);
    span.log({ id: 'm3', k3: 'v33', });

    expect(span.getData()).toMatchObject({
      logs: [
        { $time: 456, id: 'm1', k1: 'v11' },
        { $time: 457, id: 'm2', k2: 'v22' },
        { $time: 458, id: 'm3', k3: 'v33' }
      ]
    });
  });

});
