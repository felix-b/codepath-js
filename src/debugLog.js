let debugLogEnabled = false;

export const debugLog = {
  log(...args) {
    if (debugLogEnabled) {
      console.log(...args);
    }
  },
  info(...args) {
    if (debugLogEnabled) {
      console.info(...args);
    }
  },
  warn(...args) {
    if (debugLogEnabled) {
      console.warn(...args);
    }
  },
  error(...args) {
    if (debugLogEnabled) {
      console.error(...args);
    }
  }
};

export function enableDebugLog(enable) {
  debugLogEnabled = enable;
}
