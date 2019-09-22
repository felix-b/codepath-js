export function createMulticastDelegate(eventName) {
  let subscribers = [];

  const delegate = {
    add(subscriber) {
      delegate.remove(subscriber);
      subscribers.push(subscriber);
    },
    remove(subscriber) {
      subscribers = subscribers.filter(s => s !== subscriber);
    },
    invoke(...args) {
      subscribers.forEach(subscriber => {
        try {
          subscriber(...args);
        } catch (e) {
          console.log(`Event [${eventName}] invocation failed!`, e);
        }
      });
    }
  };

  return delegate;
}
