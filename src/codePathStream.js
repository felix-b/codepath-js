import { REFERENCE_FOLLOWS_FROM, REFERENCE_CHILD_OF } from "opentracing";

export function createCodePathStream() {
  let entries = [];

  return {
    writeStartTracer(time, traceId, tags) {
      entries.push({
        time,
        token: "StartTracer",
        traceId,
        tags: tags || {}
      });
    },
    writeStartSpan(time, traceId, spanId, messageId, references, tags) {
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
      entries.push({
        time,
        token: "EndSpan",
        traceId,
        spanId,
        tags: tags || {}
      });
    },
    writeLog(time, traceId, spanId, messageId, tags) {
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
      entries.push({
        time,
        token: "SpanTags",
        traceId,
        spanId,
        tags: tags || {}
      });
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
