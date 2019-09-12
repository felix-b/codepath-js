(function() {
  const h1 = document.createElement("h1");
  h1.innerHTML = "HELLO FROM CODEPATH DEV TOOLS PAGESCRIPT!";
  document.body.appendChild(h1);

  const injector = window.injectCodePathTracer;

  if (typeof injector !== "function") {
    console.warn('CODEPATH.DEVTOOLS.PAGE>', 'injector not found, page ignored', injector);
    return;
  }

  if (typeof CodePath !== "object") {
    console.error('CODEPATH.DEVTOOLS.PAGE>', 'codepath library not loaded', CodePath);
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

  console.info('CODEPATH.DEVTOOLS.PAGE>', 'successfully initialized');
})();
