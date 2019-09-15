import { childOf, followsFrom, SpanContext } from 'opentracing';
import { createCodePathStream } from '../src';

describe("codePathStream", () => {

  it("writeStartTracer", () => {
    const stream = createCodePathStream();

    stream.writeStartTracer(123, 'T#1', { k1: 'v1', k2: 'v2' });

    expect(stream.peekEntries()).toEqual([
      { 
        time: 123, 
        token: 'StartTracer', 
        traceId: 'T#1', 
        tags: { k1: 'v1', k2: 'v2' } 
      }
    ]);
  });

  it("writeStartSpan", () => {
    const stream = createCodePathStream();

    stream.writeStartSpan(
      123, 'T#1', 'S#11', 'M#11', 
      { 
        childOf: { traceId: 'T#1', spanId: 'S#10' }, 
        followsFrom: { traceId: 'T#1', spanId: 'S#9' }
      },
      { k1: 'v1', k2: 'v2' }
    );

    expect(stream.peekEntries()).toEqual([
      { 
        time: 123, 
        token: 'StartSpan', 
        traceId: 'T#1', 
        spanId: 'S#11', 
        messageId: 'M#11', 
        childOf: { traceId: 'T#1', spanId: 'S#10' }, 
        followsFrom: { traceId: 'T#1', spanId: 'S#9' }, 
        tags: { k1: 'v1', k2: 'v2' } 
      }
    ]);
  });

  it("writeEndSpan", () => {
    const stream = createCodePathStream();

    stream.writeEndSpan(123, 'T#1', 'S#11', { k1: 'v1', k2: 'v2' });

    expect(stream.peekEntries()).toEqual([
      { 
        time: 123, 
        token: 'EndSpan', 
        traceId: 'T#1', 
        spanId: 'S#11', 
        tags: { k1: 'v1', k2: 'v2' } 
      }
    ]);
  });

  it("writeLog", () => {
    const stream = createCodePathStream();

    stream.writeLog(123, 'T#1', 'S#1', 'M#1', { k1: 'v1', k2: 'v2' });

    expect(stream.peekEntries()).toEqual([
      { 
        time: 123, 
        token: 'Log', 
        traceId: 'T#1', 
        spanId: 'S#1', 
        messageId: 'M#1', 
        tags: { k1: 'v1', k2: 'v2' } 
      }
    ]);
  });

  it("accumulates multiple entries", () => {
    const stream = createCodePathStream();

    stream.writeStartTracer(123, 'T#1', { k1: 'v1', k2: 'v2' });
    stream.writeStartSpan(
      124, 'T#1', 'S#11', 'M#11', 
      { childOf: { traceId: 'T#1', spanId: 'S#10' } }, 
      { k1: 'v1', k2: 'v2' }
    );
    stream.writeLog(125, 'T#1', 'S#1', 'M#1', { k1: 'v1', k2: 'v2' });
    stream.writeEndSpan(126, 'T#1', 'S#11', { k1: 'v1', k2: 'v2' });

    expect(stream.peekEntries().length).toBe(4);
    expect(stream.peekEntries().map(e => ({ 
      time: e.time,
      token: e.token,
    }))).toEqual([
      { time: 123, token: 'StartTracer' },
      { time: 124, token: 'StartSpan' },
      { time: 125, token: 'Log' },
      { time: 126, token: 'EndSpan' },
    ]);

  });

  it("ignores written entries when disabled", () => {
    const stream = createCodePathStream({ enabled: false });

    stream.writeStartTracer(123, 'T#1');
    stream.writeStartSpan(124, 'T#1', 'S#11', 'M#11', {});
    stream.writeStartSpan(
      125, 'T#1', 'S#22', 'M#22', 
      { childOf: { traceId: 'T#1', spanId: 'S#11' } }
    );
    stream.writeLog(126, 'T#1', 'S#22', 'M#33');
    stream.writeEndSpan(127, 'T#1', 'S#22');
    stream.writeLog(128, 'T#1', 'S#11', 'M#44');
    stream.writeEndSpan(129, 'T#1', 'S#11');

    expect(stream.peekEntries().length).toBe(0);
  });

  it("starts accepting entries once enabled", () => {
    const stream = createCodePathStream({ enabled: false });

    stream.writeStartTracer(123, 'T#1');
    stream.writeStartSpan(124, 'T#1', 'S#11', 'M#11', {});
    stream.writeStartSpan(
      125, 'T#1', 'S#22', 'M#22', 
      { childOf: { traceId: 'T#1', spanId: 'S#11' } }
    );

    stream.enable();

    stream.writeLog(126, 'T#1', 'S#22', 'M#33');
    stream.writeEndSpan(127, 'T#1', 'S#22');
    stream.writeLog(128, 'T#1', 'S#11', 'M#44');
    stream.writeEndSpan(129, 'T#1', 'S#11');

    expect(stream.peekEntries().map(e => ({ 
      token: e.token, 
      messageId: e.messageId 
    }))).toMatchObject([
      { token: 'Log', messageId: 'M#33' },
      { token: 'EndSpan' },
      { token: 'Log', messageId: 'M#44' },
      { token: 'EndSpan' },
    ]);

  });

  it("stops accepting entries once disabled", () => {
    const stream = createCodePathStream();

    stream.writeStartTracer(123, 'T#1');
    stream.writeStartSpan(124, 'T#1', 'S#11', 'M#11', {});

    stream.enable(false);

    stream.writeLog(128, 'T#1', 'S#11', 'M#44');
    stream.writeEndSpan(129, 'T#1', 'S#11');

    expect(stream.peekEntries().map(e => e.token)).toMatchObject([
      'StartTracer',
      'StartSpan'
    ]);

  });

});
