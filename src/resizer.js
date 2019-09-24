export function createResizer(elements) {
  const minWidthPx = 10;
  const moveThresholdPx = 3;
  const { gripElement, leftSideElement, rightSideElement } = elements;

  let initial = undefined;
  let last = undefined;
  let saveBodyCursor = undefined;

  gripElement.onmousedown = onMouseDown;

  function takeSnapshot(e) {
    return {
      mouseX: e.pageX,
      leftWidth: leftSideElement ? leftSideElement.clientWidth : undefined,
      rightWidth: rightSideElement ? rightSideElement.clientWidth : undefined
    };
  }

  function onMouseDown(e) {
    initial = takeSnapshot(e);
    last = Object.assign({}, initial);

    window.addEventListener("mousemove", onMouseMove, true);
    window.addEventListener("mouseup", onMouseUp, true);

    saveBodyCursor = document.body.style.cursor;
    document.body.style.cursor = "ew-resize";

    e.stopPropagation();
    return false;
  }

  function onMouseMove(e) {
    const current = takeSnapshot(e);

    if (Math.abs(current.mouseX - last.mouseX) >= moveThresholdPx) {
      last = current;
      let deltaX = current.mouseX - initial.mouseX;

      if (
        initial.leftWidth &&
        deltaX < 0 &&
        initial.leftWidth + deltaX < minWidthPx
      ) {
        deltaX = -(initial.leftWidth - minWidthPx);
      }
      if (
        initial.rightWidth &&
        deltaX > 0 &&
        initial.rightWidth - deltaX < minWidthPx
      ) {
        deltaX = initial.rightWidth - minWidthPx;
      }

      if (leftSideElement && leftSideElement.style.width.length > 0) {
        leftSideElement.style.width = `${initial.leftWidth + deltaX}px`;
      }
      if (rightSideElement && rightSideElement.style.width.length > 0) {
        rightSideElement.style.width = `${initial.rightWidth - deltaX}px`;
      }
    }
    e.stopPropagation();
    return false;
  }

  function onMouseUp(e) {
    document.body.style.cursor = saveBodyCursor;
    window.removeEventListener("mousemove", onMouseMove, true);
    window.removeEventListener("mouseup", onMouseUp, true);

    initial = undefined;
    last = undefined;

    e.stopPropagation();
    return false;
  }
}
