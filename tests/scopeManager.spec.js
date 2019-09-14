const createdDeferredPromise = () => {
  let resolve = undefined;
  let reject = undefined;
  const promise = new Promise((theResolve, theReject) => {
    resolve = theResolve;
    reject = theReject;
  });
  return {
    promise,
    resolve,
    reject
  };
};

const delay = (ms) => {
  const { promise, resolve } = createdDeferredPromise();
  setTimeout(resolve, ms);
  return promise;
}

describe("scopeManager", () => {

  let globalAmbientContext = 'ROOT';

  const flowContext = (func) => {
    const saveContexct = globalAmbientContext;
    return () => {
      globalAmbientContext = saveContexct;
      func();
    };
  };

  const flowContextAsync = (promiseOrFunc) => {
    const saveContext = globalAmbientContext;
    const originalPromise = (
      typeof promiseOrFunc === 'function'
      ? promiseOrFunc()
      : promiseOrFunc);

    return new Promise((resolve , reject) => {
      originalPromise.then(value => {
        globalAmbientContext = saveContext;
        resolve(value);
      }).catch(err => {
        globalAmbientContext = saveContext;
        reject(err);
      });
    });

    // return new Promise((resolve, reject) => {
    //   globalAmbientContext = saveContext;
    //   func().then(value => {
    //     globalAmbientContext = saveContext;
    //     resolve(value)
    //   }).catch(err => {
    //     globalAmbientContext = saveContext;
    //     reject(err);
    //   });
    // });
  };

  it("can flow context to async callback", async () => {
    const deferA = createdDeferredPromise();
    globalAmbientContext = 'A';
    setTimeout(flowContext(() => {
      expect(globalAmbientContext).toBe('A');
      deferA.resolve();
    }), 100);

    const deferB = createdDeferredPromise();
    globalAmbientContext = 'B';
    setTimeout(flowContext(() => {
      expect(globalAmbientContext).toBe('B');
      deferB.resolve();
    }), 200);

    globalAmbientContext = 'ROOT';
    expect(globalAmbientContext).toBe('ROOT');

    return Promise.all([deferA.promise, deferB.promise]);
  });

  it("can flow context over await statement", async () => {

    globalAmbientContext = 'ROOT';

    const deferB = createdDeferredPromise();
    const asyncFuncA = async () => {
      expect(globalAmbientContext).toBe('A');
      await flowContextAsync(deferB.promise);
      expect(globalAmbientContext).toBe('A');
    };

    globalAmbientContext = 'B';
    setTimeout(flowContext(() => {
      expect(globalAmbientContext).toBe('B');
      deferB.resolve();
    }), 100);

    globalAmbientContext = 'A';
    await flowContextAsync(asyncFuncA);
    expect(globalAmbientContext).toBe('A');

    return deferB.promise;
  });

});
