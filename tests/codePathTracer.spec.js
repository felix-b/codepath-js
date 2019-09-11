import { createCodePathTracer, createCodePathStream } from '../src';

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

  it('can initialize with a stream', () => {
    const stream = createCodePathStream();
    const tracer = createCodePathTracer('T#1', stream, {
      clock: createClock(123)
    });

    expect(stream.peekEntries()).toEqual([
      { 
        time: 123, 
        token: 'StartTracer', 
        tracerId: 'T#1', 
        tags: {} 
      }
    ]);

  });

  it('can start root span', () => {
    const stream = createCodePathStream();
    const tracer = createCodePathTracer('T#1', stream, {
      clock: createClock(123)
    });

    const span = tracer.startSpan('R#1');

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan'
    ]);
    expect(stream.peekEntries()[1]).toEqual({ 
      time: 123, 
      token: 'StartSpan', 
      tracerId: 'T#1', 
      spanId: 1, 
      childOf: undefined, 
      followsFrom: undefined, 
      messageId: 'R#1',  
      tags: {} 
    });

  });

  it('can end root span', () => {
    const stream = createCodePathStream();
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', stream, { clock });
    const span = tracer.startSpan('R#1');
    clock.setTime(456);

    span.finish();

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan', 'EndSpan'
    ]);
    expect(stream.peekEntries()[2]).toEqual({ 
      time: 456, 
      token: 'EndSpan', 
      tracerId: 'T#1',
      spanId: 1, 
      tags: {} 
    });
  });

  it('can start child span', () => {
    const stream = createCodePathStream();
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', stream, {clock});
    const rootSpan = tracer.startSpan('R#1');
    clock.setTime(456);
    
    const childSpan = tracer.startSpan('S#11', {
      childOf: rootSpan
    });

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan', 'StartSpan'
    ]);
    expect(stream.peekEntries()[2]).toEqual({ 
      time: 456, 
      token: 'StartSpan', 
      tracerId: 'T#1', 
      spanId: 2, 
      childOf: { traceId: 'T#1', spanId: 1 }, 
      followsFrom: undefined, 
      messageId: 'S#11',  
      tags: {} 
    });
  });

  it('can end child span', () => {
    const stream = createCodePathStream();
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', stream, {clock});
    const rootSpan = tracer.startSpan('R#1');
    clock.setTime(456);
    const childSpan = tracer.startSpan('S#11', {
      childOf: rootSpan
    });
    clock.setTime(789);

    childSpan.finish();

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan', 'StartSpan', 'EndSpan'
    ]);
    expect(stream.peekEntries()[3]).toEqual({ 
      time: 789, 
      token: 'EndSpan', 
      tracerId: 'T#1',
      spanId: 2, 
      tags: {} 
    });
  });

  it('can start span with tags', () => {
    const stream = createCodePathStream();
    const tracer = createCodePathTracer('T#1', stream, {
      clock: createClock(123)
    });

    const span = tracer.startSpan('S#1', {
      tags: { k1: 'v1', k2: 'v2' }
    });

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan'
    ]);
    expect(stream.peekEntries()[1]).toEqual({ 
      time: 123, 
      token: 'StartSpan', 
      tracerId: 'T#1', 
      spanId: 1, 
      messageId: 'S#1',  
      tags: { k1: 'v1', k2: 'v2' }
    });
  });

  it('can add tags to span', () => {
    const stream = createCodePathStream();
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', stream, { clock });
    const span = tracer.startSpan('S#1', {
      tags: { k1: 'v1', k2: 'v2' }
    });
    clock.setTime(456);

    span.addTags({ k2: 'U2', k3: 'v3' });

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan', 'SpanTags'
    ]);
    expect(stream.peekEntries()[2]).toEqual({ 
      time: 456, 
      token: 'SpanTags', 
      tracerId: 'T#1',
      spanId: 1, 
      tags: { k2: 'U2', k3: 'v3' }
    });
  });

  it('can start span with specific time', () => {
    const stream = createCodePathStream();
    const tracer = createCodePathTracer('T#1', stream, {
      clock: createClock(123)
    });

    const span = tracer.startSpan('S#1', {
      startTime: 456
    });

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan'
    ]);
    expect(stream.peekEntries()[1]).toMatchObject({ 
      token: 'StartSpan', 
      time: 456, 
    });
  });

  it('can end span with specific time', () => {
    const stream = createCodePathStream();
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', stream, { clock });
    const span = tracer.startSpan('S#1');
    clock.setTime(456);

    span.finish(789);

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan', 'EndSpan'
    ]);
    expect(stream.peekEntries()[2]).toMatchObject({ 
      token: 'EndSpan', 
      time: 789, 
    });
  });

  it('can add log with current time', () => {
    const stream = createCodePathStream();
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', stream, { clock });
    const span = tracer.startSpan('S#1');
    clock.setTime(456);

    span.log({ $id: 'm1', k1: 'v1', k2: 'v2' });

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan', 'Log'
    ]);
    expect(stream.peekEntries()[2]).toMatchObject({ 
      token: 'Log', 
      time: 456,
      tracerId: 'T#1', 
      spanId: 1, 
      messageId: 'm1', 
      tags: { k1: 'v1', k2: 'v2' }
    });
  });

  it('can add log with specific time', () => {
    const stream = createCodePathStream();
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', stream, { clock });
    const span = tracer.startSpan('S#1');
    clock.setTime(456);

    span.log({ $id: 'm1', k1: 'v1', k2: 'v2' }, 789);

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan', 'Log'
    ]);
    expect(stream.peekEntries()[2]).toMatchObject({ 
      token: 'Log', 
      time: 789,
    });
  });

  it('can add multiple logs', () => {
    const stream = createCodePathStream();
    const clock = createClock(123);
    const tracer = createCodePathTracer('T#1', stream, { clock });
    const span = tracer.startSpan('S#1');

    clock.setTime(456);
    span.log({ $id: 'm1', k1: 'v11'});

    clock.setTime(457);
    span.log({ $id: 'm2', k2: 'v22'});
    
    clock.setTime(458);
    span.log({ $id: 'm3', k3: 'v33', });

    expect(stream.peekEntries().map(e => e.token)).toEqual([
      'StartTracer', 'StartSpan', 'Log', 'Log', 'Log'
    ]);
    expect(stream.peekEntries()[2]).toMatchObject({ 
      token: 'Log', 
      time: 456,
      messageId: 'm1',
      tags: { k1: 'v11' }
    });
    expect(stream.peekEntries()[3]).toMatchObject({ 
      token: 'Log', 
      time: 457,
      messageId: 'm2',
      tags: { k2: 'v22' }
    });
    expect(stream.peekEntries()[4]).toMatchObject({ 
      token: 'Log', 
      time: 458,
      messageId: 'm3',
      tags: { k3: 'v33' }
    });
  });

});
