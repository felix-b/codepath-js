export function createTestClock(initialTime) {
  let time = initialTime || 0;
  let timerById = {};
  let nextTimerId = 1001;

  const addTimer = (func, delay, type) => {
    if (typeof func !== 'function') {
      throw new Error('bad args: func');
    }
    if (typeof delay !== 'number' || isNaN(delay) || delay < 0) {
      throw new Error('bad args: delay');
    }
    const id = nextTimerId++;
    timerById[id] = { 
      func,
      delay,
      type, 
      tickTime: time + delay,
    };
    return id;
  };

  const removeTimer = (id, type) => {
    if (typeof id !== 'number' || isNaN(id) || id < 1001) {
      throw new Error('bad args: handle');
    }
    if (timerById[id]) {
      if (timerById[id].type !== type) {
        throw new Error('bad args: interval/timeout mismatch');
      }
      delete timerById[id];
    }
  };

  const clock = {
    now() {
      return time;
    },
    setInterval(func, delay) {
      return addTimer(func, delay, 'interval');
    },
    setTimeout(func, delay) {
      return addTimer(func, delay, 'timeout');
    },
    clearInterval(id) {
      removeTimer(id, 'interval');
    },
    clearTimeout(id) {
      removeTimer(id, 'timeout');
    },
    testSetTime(newTime) {
      time = newTime;
      return clock;
    },
    testExecuteTimers() {
      for (let id in timerById) { 
        const timer = timerById[id];
        if (time >= timer.tickTime) {
          timer.func();
          switch (timer.type) {
            case 'interval':
              while (time >= timer.tickTime) {
                timer.tickTime += timer.delay;
              }
              break;
            case 'timeout':
              delete timerById[id];
              break;
          }
        }
      }
      return clock;
    },
  };

  return clock;
};
