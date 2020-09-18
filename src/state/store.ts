export type Action<T extends {}> = (
  getState: GetState<T>,
  dispatch: Dispatch<T>
) => T | Promise<T> | undefined;
export type Dispatch<T extends {} = {}> = (action: Action<T>) => Promise<void>;
export type GetState<T extends {} = {}> = () => T;
export type ActionCreator<T extends {}, U extends any[]> = (
  ...args: U
) => Action<T>;

export type SelfDispatchingActionCreator<T extends any[]> = (
  ...args: T
) => Promise<void>;

export interface StoreOptions {
  verbose?: boolean;
}

export class Store<T extends {} = {}> extends EventTarget {
  #state: T;
  #verbose: boolean;

  constructor(initialState: T, options: StoreOptions = {}) {
    super();
    this.#state = initialState;
    this.#verbose = !!options.verbose;
  }

  get state() {
    return this.#state;
  }

  async dispatch(action: Action<T>): Promise<void> {
    const newState = await action(
      () => this.state,
      (action: Action<T>) => this.dispatch(action)
    );

    if (newState == null) {
      return;
    }

    if (this.#verbose) {
      console.warn('Updating state:', newState);
    }

    this.#state = newState;
    this.dispatchEvent(new CustomEvent('state-change'));
  }
}
