let logSwitch = undefined;

export function createDebugLog(component, globalVars) {
  ensureLogSwitchInitialized();

  return {
    log(...args) {
      if (logSwitch.isEnabled) {
        console.log(...args);
      }
    },
    info(...args) {
      if (logSwitch.isEnabled) {
        console.info(...args);
      }
    },
    warn(...args) {
      if (logSwitch.isEnabled) {
        console.warn(...args);
      }
    },
    error(...args) {
      if (logSwitch.isEnabled) {
        console.error(...args);
      }
    }
  };

  function ensureLogSwitchInitialized() {
    if (!logSwitch) {
      logSwitch = {
        component,
        isEnabled: false,
        setEnabled: createSetEnabled(component, globalVars)
      };
    }
  }
}

export function enableDebugLog(enable) {
  if (logSwitch) {
    logSwitch.setEnabled(enable);
    console.log(
      "CODEPATH.DEBUG-LOG>",
      `log switch [${logSwitch.component}] was set to`,
      enable
    );
  } else {
    console.log("CODEPATH.DEBUG-LOG>", "log switch was not initialized");
  }
}

function createSetEnabled(component, globalVars) {
  const createEnableLogMessage = enable => {
    return {
      type: "codePath/devTools/enableDebugLog",
      enable: !!enable
    };
  };

  const handleEnableLogMessage = message => {
    if (
      typeof message === "object" &&
      message.type === "codePath/devTools/enableDebugLog" &&
      typeof message.enable === "boolean"
    ) {
      enableDebugLog(message.enable, true);
    }
  };

  switch (component) {
    case "page":
      return enable => {
        logSwitch.isEnabled = !!enable;
        window.postMessage(createEnableLogMessage(enable), "*");
      };
    case "content":
      window.addEventListener("message", event => {
        handleEnableLogMessage(event.data);
      });
      return enable => {
        logSwitch.isEnabled = !!enable;
        chrome.runtime.sendMessage(createEnableLogMessage(enable));
      };
    case "background":
      chrome.runtime.onMessage.addListener(function(
        request,
        sender,
        sendResponse
      ) {
        handleEnableLogMessage(request);
      });
      return enable => {
        logSwitch.isEnabled = !!enable;
      };
    case "devtool":
      globalVars &&
        globalVars.backgroundConnection.onMessage.addListener(function(
          message
        ) {
          handleEnableLogMessage(message);
        });
      return enable => {
        logSwitch.isEnabled = !!enable;
      };
    default:
      return enable => {
        logSwitch.isEnabled = !!enable;
      };
  }
}
