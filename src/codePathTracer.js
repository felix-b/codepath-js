import { 
  Tracer, 
  Span, 
  SpanContext, 
  Reference, 
  REFERENCE_FOLLOWS_FROM,
  REFERENCE_CHILD_OF 
} from "opentracing";

export class CodePathTracer extends Tracer {
  _traceId;
  _nextSpanId;
  _clock;
  _scopeManager;

  constructor(traceId, options) {
    super();
    this._traceId = traceId;
    this._nextSpanId = 1;
    this._clock = options.clock;
    this._scopeManager = options.scopeManager;
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
    return new CodePathSpan(this, this._nextSpanId++, name, options);
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
    return new CodePathSpanContext('', '');
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
  _context;
  _operationName;
  _startTime;
  _endTime;
  _baggageItems;
  _tags;
  _logs;

  constructor(tracer, spanId, name, options) {
    super();
    this._tracer = tracer;
    this._context = new CodePathSpanContext(tracer.getTraceId(), spanId);
    this._operationName = name;
    this._startTime = (options && options.startTime) || tracer.getCurrentTime();
    this._endTime = undefined;
    this._baggageItems = {};
    this._tags = {};
    this._logs = [];
  }

  // By default returns a no-op SpanContext.
  // protected _context(): SpanContext {
  //     return noop.spanContext!;
  // }
  _context() {
    return this._context;
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
    this._operationName = name;
  }

  // By default does nothing
  // protected _setBaggageItem(key: string, value: string): void {
  // }
  _setBaggageItem(key, value) {
    this._baggageItems[key] = value;
  }

  // By default does nothing
  // protected _getBaggageItem(key: string): string | undefined {
  //     return undefined;
  // }
  _getBaggageItem(key) {
    return this._baggageItems[key];
  }

  // By default does nothing
  //
  // NOTE: both setTag() and addTags() map to this function. keyValuePairs
  // will always be an associative array.
  // protected _addTags(keyValuePairs: { [key: string]: any }): void {
  // }
  _addTags(keyValuePairs) {
    this._tags = {
      ...this._tags,
      ...keyValuePairs
    };
  }

  // By default does nothing
  // protected _log(keyValuePairs: { [key: string]: any }, timestamp?: number): void {
  // }
  _log(keyValuePairs, timestamp) {
    const logEntry = {
      ...(keyValuePairs || {}),
      $time: timestamp || this._tracer.getCurrentTime()
    };
    this._logs.push(logEntry);
  }

  // By default does nothing
  //
  // finishTime is expected to be either a number or undefined.
  // protected _finish(finishTime?: number): void {
  // }
  _finish(finishTime) {
    if (this._endTime) {
      throw new Error("Invalid operation: span already finished");
    }
    this._endTime = finishTime || this._tracer.getCurrentTime();
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
