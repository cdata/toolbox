export class Deferred<T> {
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
