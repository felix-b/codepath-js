import {
  Tracer,
  Reference,
  REFERENCE_FOLLOWS_FROM,
  REFERENCE_CHILD_OF
} from "opentracing";

import { createCodePathTracer } from "./codePathTracer";
import { createCodePathStream } from "./codePathStream";

export const LOG_LEVEL = {
  debug: 0,
  event: 1,
  warning: 2,
  error: 3,
  critical: 4
};

export const createRealLowResolutionClock = () => {
  return {
    now() {
      return new Date().getTime();
    }
  };
};

export const createDefaultScopeManager = () => {
  let activeTracer = undefined;
  let activeSpan = undefined;
  return {
    getActiveTracer() {
      return activeTracer;
    },
    getActiveSpan() {
      return activeSpan;
    },
    setActiveTracer(tracer) {
      activeTracer = tracer;
    },
    setActiveSpan(span) {
      activeSpan = span;
    }
  };
};

export const noopTracerFactory = () => new Tracer();

export const defaultTracerFactory = (stream, options) =>
  createCodePathTracer(`webuser${options.clock.now()}`, stream, options);

export const GlobalCodePath = {
  configure(options) {
    const { input, output } = createCodePath(options);
    Object.assign(GlobalCodePath, {
      ...input,
      getOutputStream() {
        return output;
      }
    });
  },
  getOutputStream() {
    throw new Error("GlobalCodePath was not configured");
  }
};

export function createCodePath(options) {
  const clock = (options && options.clock) || createRealLowResolutionClock();
  const scopeManager =
    (options && options.scopeManager) || createDefaultScopeManager();
  const tracerFactory =
    (options && options.tracerFactory) || defaultTracerFactory;
  const outputStream =
    (options && options.outputStream) || createCodePathStream();
  const spanEntries = {};

  const getOrCreateActiveTracer = () => {
    const existingTracer = scopeManager.getActiveTracer();
    if (existingTracer) {
      return existingTracer;
    }

    const newTracer = tracerFactory({ clock, scopeManager, tracerFactory });
    scopeManager.setActiveTracer(newTracer);
    return newTracer;
  };

  const getParentSpanContext = parentContext => {
    if (parentContext) {
      return parentContext;
    }
    const existingSpan = scopeManager.getActiveSpan();
    if (existingSpan) {
      return existingSpan.context();
    }
  };

  const logToActiveSpan = tags => {
    const existingSpan = scopeManager.getActiveSpan();
    if (existingSpan) {
      existingSpan.log(tags);
    } else {
      const tempSpan = activeTracer.startSpan("unknown-root");
      tempSpan.log(tags);
      tempSpan.finish();
    }
  };

  const startSpan = (id, tags, parentContext, parentReferenceType) => {
    const tracer = getOrCreateActiveTracer();
    const parentReferenceContext = getParentSpanContext(parentContext);
    const spanOptions = {
      references: parentReferenceContext && [
        new Reference(parentReferenceType, parentReferenceContext)
      ],
      tags
    };
    const childSpan = tracer.startSpan(id, spanOptions);
    scopeManager.setActiveSpan(childSpan);
    const childSpanId = childSpan.context().toSpanId();
    spanEntries[childSpanId] = {
      span: childSpan,
      options: spanOptions
    };
    return childSpan;
  };

  scopeManager.setActiveTracer(
    tracerFactory(outputStream, {
      clock,
      scopeManager,
      tracerFactory
    })
  );

  const thisCodePath = {
    logDebug(id, tags) {
      logToActiveSpan({ $id: id, level: LOG_LEVEL.debug, ...tags });
    },
    logEvent(id, tags) {
      logToActiveSpan({ $id: id, level: LOG_LEVEL.event, ...tags });
    },
    logWarning(id, tags) {
      logToActiveSpan({ $id: id, level: LOG_LEVEL.warning, ...tags });
    },
    logError(id, tags) {
      logToActiveSpan({ $id: id, level: LOG_LEVEL.error, ...tags });
    },
    logCritical(id, tags) {
      logToActiveSpan({ $id: id, level: LOG_LEVEL.critical, ...tags });
    },
    spanChild(id, tags, parentContext) {
      return startSpan(id, tags, parentContext, REFERENCE_CHILD_OF);
    },
    spanFollower(id, tags, parentContext) {
      return startSpan(id, tags, parentContext, REFERENCE_FOLLOWS_FROM);
    },
    finishSpan(tags) {
      const activeSpan = scopeManager.getActiveSpan();
      if (!activeSpan) {
        throw new Error("Current scope has no active span");
      }
      activeSpan.finish();
      if (!activeSpan.doesNotifyTracerOnFinish) {
        thisCodePath.notifySpanFinished(activeSpan);
      }
    },
    notifySpanFinished(span) {
      const spanContext = span.context();
      const spanId = spanContext.toSpanId();
      const traceId = spanContext.toTraceId();
      const entry = spanEntries[spanId];
      if (!entry) {
        throw new Error(`Trace span not found: id [${spanId}]`);
      }
      const parentContext =
        entry.options.references &&
        entry.options.references[0].referencedContext();
      if (parentContext && parentContext.toTraceId() === traceId) {
        const parentEntry = spanEntries[parentContext.toSpanId()];
        if (parentEntry) {
          scopeManager.setActiveSpan(parentEntry.span);
        }
      }
      delete spanEntries[spanId];
    }
  };

  return {
    input: thisCodePath,
    output: outputStream
  };
}
