export type Action<T extends {}> = (
  getState: GetState<T>,
  dispatch: Dispatch<T>
) => T | Promise<T>;
export type Dispatch<T extends {} = {}> = (action: Action<T>) => Promise<void>;
export type GetState<T extends {} = {}> = () => T;
export type ActionCreator<T extends {}, U extends any[]> = (
  ...args: U
) => Action<T>;

export type SelfDispatchingActionCreator<T extends any[]> = (
  ...args: T
) => Promise<void>;

export class Store<T extends {} = {}> extends EventTarget {
  #state: T;

  constructor(initialState: T) {
    super();
    this.#state = initialState;
  }

  get state() {
    return this.#state;
  }

  async dispatch(action: Action<T>): Promise<void> {
    const newState = await action(
      () => this.state,
      (action: Action<T>) => this.dispatch(action)
    );

    console.warn('newState:', newState);
    this.#state = newState;
    this.dispatchEvent(new CustomEvent('state-change'));
  }
}
