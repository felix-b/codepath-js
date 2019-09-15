(function() {
  // const h1 = document.createElement("h1");
  // h1.innerHTML = "HELLO FROM CODEPATH DEV TOOLS PAGESCRIPT!";
  // document.body.appendChild(h1);

  attemptInstall();

  function attemptInstall() {
    const injector = window.__CODEPATH_INJECTOR__;

    if (typeof injector === "function") {
      installCodePathOnPage(injector);
    } else {
      console.warn('CODEPATH.DEVTOOLS.PAGE>', 'injector not ready; installing on-ready notification');
      window.__CODEPATH_INJECTOR_READY__ = attemptInstall;
    }
  }

  function installCodePathOnPage(injector) {
    if (typeof CodePath !== "object") {
      console.error('CODEPATH.DEVTOOLS.PAGE>', 'codepath library not loaded; page ignored', CodePath);
      return;
    }
  
    const { input, output } = CodePath.createCodePath();

    injector(input);

    setInterval(() => {
      if (output.peekEntries().length > 0) {
        const entries = output.takeEntries();
        window.postMessage({
          type: 'codePath/devTools/publishEntries',
          entries
        }, '*');
      }
    }, 250);

    console.info('CODEPATH.DEVTOOLS.PAGE>', 'successfully installed');
  }
})();
