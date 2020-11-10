/**
 * A Deferred is like an inside-out Promise. Instead of passing a
 * function to the constructor that receives resolve and reject callbacks,
 * a deferred has the resolve and reject callbacks and their associated
 * promise as public properties on the instance. A Deferred is not a
 * then-able; you must still use the promise for then-related purposes.
 */
export class Deferred<T = void> {
  #resolve: (value?: T | PromiseLike<T> | undefined) => void = () => {};
  #reject: (reason?: any) => void = () => {};
  #promise: Promise<T>;

  get promise() {
    return this.#promise;
  }

  get resolve() {
    return this.#resolve;
  }

  get reject() {
    return this.#reject;
  }

  constructor() {
    this.#promise = new Promise<T>((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }
}
