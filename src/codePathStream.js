import { REFERENCE_FOLLOWS_FROM, REFERENCE_CHILD_OF } from "opentracing";
import { isTagSerializable, addTagMetaStringify } from "./serializable";

export function createCodePathStream(options) {
  const isStripTagsMode = options && options.stripTags;
  let entries = [];
  let isEnabled = options ? !!options.enabled : true;
  let strippedTagsById = {};
  let nextStrippedTagsId = 1;

  return {
    writeStartTracer(time, traceId, tags) {
      if (!isEnabled) {
        return;
      }
      entries.push({
        time,
        token: "StartTracer",
        traceId,
        tags: includeOrStripTags(tags)
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
        tags: includeOrStripTags(tags)
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
        tags: includeOrStripTags(tags)
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
        tags: includeOrStripTags(tags)
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
        tags: includeOrStripTags(tags)
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
      if (!isStripTagsMode) {
        copyOfEntries.forEach(entry => normalizeTags(entry.tags));
      }
      return copyOfEntries;
    },
    clearAll() {
      entries = [];
      strippedTagsById = {};
    },
    getStrippedTags(ids) {
      if (!isStripTagsMode) {
        throw new Error("CodePathStream is not in stripped tags mode");
      }

      let result = {};
      ids.forEach(id => {
        result[id] = strippedTagsById[id];
        normalizeTags(strippedTagsById[id]);
      });
      return result;
    }
  };

  function includeOrStripTags(tags) {
    if (!tags) {
      return {};
    }
    if (isStripTagsMode && Object.keys(tags).length > 0) {
      const $$id = nextStrippedTagsId++;
      strippedTagsById[$$id] = tags;
      return { $$id };
    }
    return tags;
  }

  function normalizeTags(tags) {
    let visitedObjects;

    if (typeof tags === "object") {
      visitedObjects = new Set();

      for (let key in tags) {
        const value = tags[key];

        if (!isTagSerializable(value)) {
          addTagMetaStringify(tags, key);
          tags[key] = safeStringify(value);
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
      if (json && json.length > 16384) {
        return json.substr(0, 16384) + "...[trunc]";
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
