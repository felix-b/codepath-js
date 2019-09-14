import {
  Tracer,
  Span,
  SpanContext,
  Reference,
  REFERENCE_FOLLOWS_FROM,
  REFERENCE_CHILD_OF
} from "opentracing";

export function createCodePathTracer(traceId, stream, options) {
  return new CodePathTracer(traceId, stream, options);
}

class CodePathTracer extends Tracer {
  _traceId;
  _clock;
  _scopeManager;
  _stream;
  _nextSpanId;

  constructor(traceId, stream, options) {
    super();
    this._traceId = traceId;
    this._nextSpanId = 1;
    this._clock = options.clock;
    this._scopeManager = options.scopeManager;
    this._stream = stream;

    stream.writeStartTracer(options.clock.now(), traceId);
  }

  // NOTE: the input to this method is *always* an associative array. The
  // public-facing startSpan() method normalizes the arguments so that
  // all N implementations do not need to worry about variations in the call
  // signature.
  //
  // The default behavior returns a no-op span.
  // protected _startSpan(name: string, fields: SpanOptions): Span {
  //   return Noop.span!;
  // }
  _startSpan(name, options) {
    return new CodePathSpan(
      this,
      this._clock,
      this._stream,
      this._nextSpanId++,
      name,
      options
    );
  }

  // The default behavior is a no-op.
  // protected _inject(spanContext: SpanContext, format: string, carrier: any): void {
  // }
  _inject(spanContext, format, carrier) {}

  // The default behavior is to return a no-op SpanContext.
  // protected _extract(format: string, carrier: any): SpanContext | null {
  //   return Noop.spanContext!;
  // }
  _extract(format, carrier) {
    return new CodePathSpanContext("", "");
  }

  getTraceId() {
    return this._traceId;
  }

  getCurrentTime() {
    return this._clock.now();
  }
}

class CodePathSpan extends Span {
  _tracer;
  _clock;
  _stream;
  _selfContext;
  // _childOfContext;
  // _followsFromContext;
  // _operationName;
  // _startTime;
  // _endTime;
  // _baggageItems;
  // _tags;
  // _logs;

  constructor(tracer, clock, stream, spanId, name, options) {
    super();

    const traceId = tracer.getTraceId();

    this._tracer = tracer;
    this._clock = clock;
    this._stream = stream;
    this._selfContext = new CodePathSpanContext(traceId, spanId);

    const startTime = (options && options.startTime) || clock.now();
    const { childOf, followsFrom } = findReferences(options);

    stream.writeStartSpan(
      startTime,
      traceId,
      spanId,
      name,
      {
        childOf: contextToPlain(childOf),
        followsFrom: contextToPlain(followsFrom)
      },
      options.tags
    );

    // this._operationName = name;
    // this._startTime = (options && options.startTime) || tracer.getCurrentTime();
    // this._endTime = undefined;
    // this._baggageItems = {};
    // this._tags = (options && options.tags) || {};
    // this._logs = [];
  }

  // getData() {
  //   return {
  //     context: contextToPlain(this._selfContext),
  //     childOf: contextToPlain(this._childOfContext),
  //     followsFrom: contextToPlain(this._followsFromContext),
  //     operationName: this._operationName,
  //     startTime: this._startTime,
  //     endTime: this._endTime,
  //     baggageItems: this._baggageItems,
  //     tags: this._tags,
  //     logs: this._logs
  //   };
  // }

  // By default returns a no-op SpanContext.
  // protected _context(): SpanContext {
  //     return noop.spanContext!;
  // }
  _context() {
    return this._selfContext;
  }

  // By default returns a no-op tracer.
  //
  // The base class could store the tracer that created it, but it does not
  // in order to ensure the no-op span implementation has zero members,
  // which allows V8 to aggressively optimize calls to such objects.
  // protected _tracer(): Tracer {
  //     return noop.tracer!;
  // }
  _tracer() {
    return this._tracer;
  }

  // By default does nothing
  // protected _setOperationName(name: string): void {
  // }
  _setOperationName(name) {
    throw new Error("Not supported: setOperationName");
    //this._operationName = name;
  }

  // By default does nothing
  // protected _setBaggageItem(key: string, value: string): void {
  // }
  _setBaggageItem(key, value) {
    throw new Error("Not supported: setBaggageItem");
    //this._baggageItems[key] = value;
  }

  // By default does nothing
  // protected _getBaggageItem(key: string): string | undefined {
  //     return undefined;
  // }
  _getBaggageItem(key) {
    return undefined;
    //return this._baggageItems[key];
  }

  // By default does nothing
  //
  // NOTE: both setTag() and addTags() map to this function. keyValuePairs
  // will always be an associative array.
  // protected _addTags(keyValuePairs: { [key: string]: any }): void {
  // }
  _addTags(keyValuePairs) {
    const { traceId, spanId } = contextToPlain(this._selfContext);
    this._stream.writeSpanTags(
      this._clock.now(),
      traceId,
      spanId,
      keyValuePairs
    );
    // this._tags = {
    //   ...this._tags,
    //   ...keyValuePairs
    // };
  }

  // By default does nothing
  // protected _log(keyValuePairs: { [key: string]: any }, timestamp?: number): void {
  // }
  _log(keyValuePairs, timestamp) {
    const time = timestamp || this._clock.now();
    const { traceId, spanId } = contextToPlain(this._selfContext);
    this._stream.writeLog(
      time,
      traceId,
      spanId,
      keyValuePairs.$id,
      keyValuePairs
    );
    // const logEntry = {
    //   ...(keyValuePairs || {}),
    //   $time: timestamp || this._tracer.getCurrentTime()
    // };
    // this._logs.push(logEntry);
  }

  // By default does nothing
  //
  // finishTime is expected to be either a number or undefined.
  // protected _finish(finishTime?: number): void {
  // }
  _finish(finishTime) {
    const effectiveFinishTime = finishTime || this._clock.now();
    const { traceId, spanId } = contextToPlain(this._selfContext);
    this._stream.writeEndSpan(effectiveFinishTime, traceId, spanId);

    // if (this._endTime) {
    //   throw new Error("Invalid operation: span already finished");
    // }
    // this._endTime = finishTime || this._tracer.getCurrentTime();
  }
}

class CodePathSpanContext extends SpanContext {
  _traceId;
  _spanId;

  constructor(traceId, spanId) {
    super();
    this._traceId = traceId;
    this._spanId = spanId;
  }

  /**
   * Returns a string representation of the implementation internal trace ID.
   *
   * @returns {string}
   */
  toTraceId() {
    return this._traceId;
  }

  /**
   * Returns a string representation of the implementation internal span ID.
   *
   * @returns {string}
   */
  toSpanId() {
    return this._spanId;
  }
}

function findReferences(options) {
  let childOf = undefined;
  let followsFrom = undefined;

  options &&
    options.references &&
    options.references.forEach(ref => {
      switch (ref.type()) {
        case REFERENCE_CHILD_OF:
          childOf = ref.referencedContext();
          break;
        case REFERENCE_FOLLOWS_FROM:
          followsFrom = ref.referencedContext();
          break;
      }
    });

  return {
    childOf,
    followsFrom
  };
}

export function contextToPlain(context) {
  if (context) {
    return {
      traceId: context.toTraceId(),
      spanId: context.toSpanId()
    };
  }
}

export function plainToContext({ traceId, spanId }) {
  return new CodePathSpanContext(traceId, spanId);
}
