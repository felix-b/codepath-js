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
  },

};

/*


const LOG_LEVEL = codePathLib.LOG_LEVEL; return { treeGrid: { }, codePathModel: { extractEntryMetrics: (entry) => { switch (entry.tags.level) { case LOG_LEVEL.event: return { event: 1 }; case LOG_LEVEL.warning: return { warning: 1 }; case LOG_LEVEL.error: return { error: 1 }; case LOG_LEVEL.critical: return { error: 1 }; default: return undefined; } } }, pageInit: '!function(){window.__CODEPATH_INJECTOR__=((e,n,o)=>{console.log("CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>","injecting AppHost logger");const t=function(e){return{event(n,o,t,i){switch(function(e){if("string"==typeof e.$api&&Array.isArray(e.$args)){let n=!1;for(let o=0;o<e.$args.length;o++){const t=e.$args[o],i=typeof t;if("function"===i||"object"===i&&null!==t){n=!0;break}}n&&(e.$meta={stringify:["$args"]})}}(t),i){case"begin":e.spanChild(o,t);break;case"end":e.finishSpan();break;default:e.logDebug(o,t)}}}}(e);repluggableAppDebug.host.log=t,console.log("CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>","successfully injected AppHost logger")}),"function"==typeof window.__CODEPATH_INJECTOR_READY__&&window.__CODEPATH_INJECTOR_READY__()}();' };
const LOG_LEVEL = codePathLib.LOG_LEVEL; return { treeGrid: { }, codePathModel: { extractEntryMetrics: (entry) => { switch (entry.tags.level) { case LOG_LEVEL.event: return { event: 1 }; case LOG_LEVEL.warning: return { warning: 1 }; case LOG_LEVEL.error: return { error: 1 }; case LOG_LEVEL.critical: return { error: 1 }; default: return undefined; } } }, pageInit: \'!function(){window.__CODEPATH_INJECTOR__=((e,n,o)=>{console.log(\"CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>\",\"injecting AppHost logger\");const t=function(e){return{event(n,o,t,i){switch(function(e){if(\"string\"==typeof e.$api&&Array.isArray(e.$args)){let n=!1;for(let o=0;o<e.$args.length;o++){const t=e.$args[o],i=typeof t;if(\"function\"===i||\"object\"===i&&null!==t){n=!0;break}}n&&(e.$meta={stringify:[\"$args\"]})}}(t),i){case\"begin\":e.spanChild(o,t);break;case\"end\":e.finishSpan();break;default:e.logDebug(o,t)}}}}(e);repluggableAppDebug.host.log=t,console.log(\"CODEPATH.DEVTOOLS.REPLUGGABLE-ADAPTER>\",\"successfully injected AppHost logger\")}),\"function\"==typeof window.__CODEPATH_INJECTOR_READY__&&window.__CODEPATH_INJECTOR_READY__()}();\' };
*/