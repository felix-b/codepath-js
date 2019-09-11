import { REFERENCE_FOLLOWS_FROM, REFERENCE_CHILD_OF } from "opentracing";

export function createCodePathStream() {
  let entries = [];

  return {
    writeStartTracer(time, tracerId, tags) {
      entries.push({
        time,
        token: "StartTracer",
        tracerId,
        tags: tags || {}
      });
    },
    writeStartSpan(time, tracerId, spanId, messageId, references, tags) {
      const { childOf, followsFrom } = references;
      entries.push({
        time,
        token: "StartSpan",
        tracerId,
        spanId,
        childOf,
        followsFrom,
        messageId,
        tags: tags || {}
      });
    },
    writeEndSpan(time, tracerId, spanId, tags) {
      entries.push({
        time,
        token: "EndSpan",
        tracerId,
        spanId,
        tags: tags || {}
      });
    },
    writeLog(time, tracerId, spanId, messageId, tags) {
      entries.push({
        time,
        token: "Log",
        tracerId,
        spanId,
        messageId,
        tags: tags || {}
      });
    },
    writeSpanTags(time, tracerId, spanId, tags) {
      entries.push({
        time,
        token: "SpanTags",
        tracerId,
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
