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
    writeStartSpan(time, traceId, spanId, messageId, references, tags, epoch) {
      if (!isEnabled) {
        return;
      }
      const { childOf, followsFrom } = references;
      entries.push({
        time,
        epoch,
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
      copyOfEntries.forEach(normalizeTags);
      return copyOfEntries;
    },
    clearAll() {
      entries = [];
    }
  };

  function normalizeTags(entry) {
    let visitedObjects = new Set();

    if (entry.tags) {
      const meta = entry.tags.$meta;
      if (meta && meta.stringify) {
        for (let tag of meta.stringify) {
          entry.tags[tag] = safeStringify(entry.tags[tag]);
        }
      }
    }

    function safeStringify(obj) {
      let json = null;
      try {
        json = JSON.stringify(obj);
      } catch (err) {
        json = JSON.stringify(obj, replaceCircularReferences);
      }
      if (json && json.length > 4096) {
        return json.substr(0, 4096) + "...[trunc]";
      }
      return json;
    }

    function replaceCircularReferences(key, value) {
      if (typeof value === "object" && value !== null) {
        if (visitedObjects.has(value)) {
          return "[circ]";
        }
        visitedObjects.add(value);
      }
      return value;
    }
  }
}
