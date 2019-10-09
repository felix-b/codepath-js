//argument: codePathLib

const LOG_LEVEL = codePathLib.LOG_LEVEL;

return {
  treeGrid: {

  },
  codePathModel: {
    extractEntryMetrics: (entry) => {
      switch (entry.tags.level) {
        case LOG_LEVEL.event: return { event: 1 };
        case LOG_LEVEL.warning: return { warning: 1 };
        case LOG_LEVEL.error: return { error: 1 };
        case LOG_LEVEL.critical: return { error: 1 };
        default: return undefined;
      }
    }
  }
};

/*


const LOG_LEVEL = codePathLib.LOG_LEVEL; return { treeGrid: { }, codePathModel: { extractEntryMetrics: (entry) => { switch (entry.tags.level) { case LOG_LEVEL.event: return { event: 1 }; case LOG_LEVEL.warning: return { warning: 1 }; case LOG_LEVEL.error: return { error: 1 }; case LOG_LEVEL.critical: return { error: 1 }; default: return undefined; } } } };


*/