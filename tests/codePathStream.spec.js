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

  it("writeStartSpanWithEpoch", () => {
    const stream = createCodePathStream();

    stream.writeStartSpan(
      123, 'T#1', 'S#11', 'M#11', 
      { },
      { k1: 'v1', k2: 'v2' },
      111222333
    );

    expect(stream.peekEntries()).toEqual([
      { 
        time: 123, 
        epoch: 111222333,
        token: 'StartSpan', 
        traceId: 'T#1', 
        spanId: 'S#11', 
        messageId: 'M#11', 
        childOf: undefined, 
        followsFrom: undefined, 
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

  it("serializes non-scalar tag values on takeEntries", () => {
    const stream = createCodePathStream();
    const tags = { 
      $meta: {
        stringify: ['func','obj','arr','date']
      },
      str: 'abc',
      num: 123,
      bool: true,
      func: () => {},
      obj: { x: 1, y: 2 },
      arr1: [ 1, "two", true ],
      arr2: [ 1, {x:1, y:2}, 3 ],
      date: new Date("2019-10-01T10:30:00.000Z")
    };

    stream.writeStartTracer(123, 'T#1');
    stream.writeStartSpan(124, 'T#1', 'S#11', 'M#11', {}, tags);

    const peekEntriesTags = stream.peekEntries().map(e => e.tags);
    const takeEntriesTags = stream.takeEntries().map(e => e.tags);

    expect(peekEntriesTags).toMatchObject([ {}, tags ]);
    expect(takeEntriesTags).toMatchObject([ 
      {},
      { 
        str: 'abc',
        num: 123,
        bool: true,
        func: undefined,
        obj: '{"x":1,"y":2}',
        arr1: [1,"two",true],
        arr2: "[1,{\"x\":1,\"y\":2},3]",
        date: '"2019-10-01T10:30:00.000Z"'
      } 
    ]);

  });

  it("serializes tag values which are objects with circular references", () => {
    const stream = createCodePathStream();
    const tags = { 
      $meta: {
        stringify: ['obj1', 'obj2']
      },
      obj1: { x: 1 },
      obj2: { x: 2 },
    };
    tags.obj1.obj2 = tags.obj2;
    tags.obj2.obj1 = tags.obj1;

    stream.writeStartTracer(123, 'T#1');
    stream.writeStartSpan(124, 'T#1', 'S#11', 'M#11', {}, tags);

    const takeEntriesTags = stream.takeEntries().map(e => e.tags);

    //console.log(takeEntriesTags)

    expect(takeEntriesTags).toMatchObject([ 
      {},
      { 
        obj1: '{"x":1,"obj2":{"x":2,"obj1":"[circ]"}}',
        obj2: '"[circ]"',
      } 
    ]);

  });

  describe('stripped tags flow', () => {

    const writeSomeEntries = (stream) => {
      stream.writeStartTracer(120, 'T#1', { a: 1, b: 2 });
      stream.writeStartSpan(121, 'T#1', 'S#11', 'M#11', {}, { c: 3, d: 4 });
      stream.writeLog(122, 'T#1', 'S#22', 'M#33', { e: 5, f: 6 });
      stream.writeStartSpan(123, 'T#1', 'S#11', 'M#11', {});
      stream.writeLog(124, 'T#1', 'S#11', 'M#44');
      stream.writeEndSpan(125, 'T#1', 'S#22', { g: 7, h: 8 });
      stream.writeLog(126, 'T#1', 'S#11', 'M#44');
      stream.writeEndSpan(127, 'T#1', 'S#11');
    };

    it("can strip tags from entries", () => {
      const stream = createCodePathStream({ 
        enabled: true, 
        stripTags: true 
      });

      writeSomeEntries(stream);

      const takeEntriesTags = stream.takeEntries().map(e => ({ 
        time: e.time, 
        tags: e.tags 
      }));

      expect(takeEntriesTags).toMatchObject([ 
        { time: 120, tags: { $$id: 1 } },
        { time: 121, tags: { $$id: 2 } },
        { time: 122, tags: { $$id: 3 } },
        { time: 123, tags: { } },
        { time: 124, tags: { } },
        { time: 125, tags: { $$id: 4 } },
        { time: 126, tags: { } },
        { time: 127, tags: { } },
      ]);
    });

    it("can fetch stripped tags by id", () => {
      const stream = createCodePathStream({ 
        enabled: true, 
        stripTags: true 
      });

      writeSomeEntries(stream);

      expect(stream.getStrippedTags([ 1 ])).toMatchObject({ 
        1: { a: 1, b: 2 }
      });

      expect(stream.getStrippedTags([ 2, 4 ])).toMatchObject({ 
        2: { c: 3, d: 4 },
        4: { g: 7, h: 8 },
      });

      expect(stream.getStrippedTags([ 123 ])).toMatchObject({ 
        123: undefined
      });
    });

    it("can clear stripped tags with clearAll", () => {
      const stream = createCodePathStream({ 
        enabled: true, 
        stripTags: true 
      });

      writeSomeEntries(stream);
      stream.clearAll();

      expect(stream.getStrippedTags([ 1, 2, 3, 4 ])).toMatchObject({ 
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
      });
    });

  });

});
