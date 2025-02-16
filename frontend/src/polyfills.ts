// frontend/src/polyfills.ts

if (typeof Promise.withResolvers !== "function") {
    Promise.withResolvers = function <T>() {
      let _resolve: (value: T | PromiseLike<T>) => void;
      let _reject: (reason?: any) => void;
      const promise = new Promise<T>((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
      });
      return { promise, resolve: _resolve!, reject: _reject! };
    };
  }
  