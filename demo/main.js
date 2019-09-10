(function() {
  const init = () => {
    console.log('DEMO > CodePath =', CodePath);
    const tracer = CodePath.cre


    const button1 = document.querySelector('.button-1');
    button1.onclick = () => {

    };
  };

  const { readyState } = document;
  if (readyState === "complete" || readyState === "loaded" || readyState === "interactive") {
    init(); 
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }

})();
