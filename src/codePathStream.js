import { REFERENCE_FOLLOWS_FROM, REFERENCE_CHILD_OF } from "opentracing";

export function createCodePathStream(options) {
  let entries = [];
  let isEnabled = options ? !!options.enabled : true;

  return {
    writeStartTracer(time, traceId, tags) {
      if (!isEnabled) {
        return;
      }
      entries.push({
        time,
        token: "StartTracer",
        traceId,
        tags: tags || {}
      });
    },
    writeStartSpan(time, traceId, spanId, messageId, references, tags) {
      if (!isEnabled) {
        return;
      }
      const { childOf, followsFrom } = references;
      entries.push({
        time,
        token: "StartSpan",
        traceId,
        spanId,
        childOf,
        followsFrom,
        messageId,
        tags: tags || {}
      });
    },
    writeEndSpan(time, traceId, spanId, tags) {
      if (!isEnabled) {
        return;
      }
      entries.push({
        time,
        token: "EndSpan",
        traceId,
        spanId,
        tags: tags || {}
      });
    },
    writeLog(time, traceId, spanId, messageId, tags) {
      if (!isEnabled) {
        return;
      }
      entries.push({
        time,
        token: "Log",
        traceId,
        spanId,
        messageId,
        tags: tags || {}
      });
    },
    writeSpanTags(time, traceId, spanId, tags) {
      if (!isEnabled) {
        return;
      }
      entries.push({
        time,
        token: "SpanTags",
        traceId,
        spanId,
        tags: tags || {}
      });
    },
    enable(value) {
      const effectiveValue = typeof value === "undefined" ? true : !!value;
      isEnabled = effectiveValue;
    },
    peekEntries() {
      return entries;
    },
    takeEntries() {
      const copyOfEntries = entries;
      entries = [];
      return copyOfEntries;
    }
  };
}
