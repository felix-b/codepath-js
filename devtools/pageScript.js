(function() {
    const h1 = document.createElement('h1');
    h1.innerHTML = 'HELLO FROM CODEPATH DEV TOOLS PAGESCRIPT!';
    document.body.appendChild(h1);
  
    const injector = window.injectCodePathTracer;
  
    if (typeof injector !== 'function') {
      console.log('CODEPATH DEVTOOLS>', 'injector not found', injector);
      return;
    }
  
    if (typeof CodePath !== 'object') {
      console.log('CODEPATH DEVTOOLS>', 'codepath library not loaded');
      return;
    }
  
    const { input, output } = CodePath.createCodePath();
  
    injector(input);
  
    setInterval(() => {
      if (output.peekEntries().length > 0) {
        const entries = output.takeEntries();
        console.log('CODEPATH DEVTOOLS > OUTPUT>', entries);
      }
    }, 1000);
  
    console.log('CODEPATH DEVTOOLS>', 'successfully initialized');
  
  })();
  