import { createRealClock } from "./codePath";

export function createDebounce(consumer, interval, optionalClock) {
  const clock = optionalClock || createRealClock();
  let timeoutId = undefined;

  return {
    bounce() {
      if (timeoutId) {
        clock.clearTimeout(timeoutId);
      }
      timeoutId = clock.setTimeout(() => {
        timeoutId = undefined;
        consumer();
      }, interval);
    }
  };
}
