export type Action<T extends {}> = (
  getState: GetState<T>,
  dispatch: Dispatch<T>
) => T | void | Promise<T | void>;
export type Dispatch<T extends {} = {}> = (action: Action<T>) => Promise<void>;
export type GetState<T extends {} = {}> = () => T;
export type ActionCreator<T extends {}, U extends readonly any[]> = (
  ...args: U
) => Action<T>;

export const $name = Symbol('name');
export type NamedAction<T extends {}> = Action<T> & {
  [$name]: string;
};

export type SelfDispatchingActionCreator<T extends any[]> = (
  ...args: T
) => Promise<void>;

export type Middleware<T extends {}> = (store: Store<T>) => Store<T>;

export interface StoreOptions<T extends {}> {
  verbose?: boolean;
  middleware?: Middleware<T>[];
}

export const action = <T extends {}>(
  name: string,
  action: Action<T>
): NamedAction<T> => {
  (action as NamedAction<T>)[$name] = name;
  return action as NamedAction<T>;
};

export const isNamedAction = <T extends {}>(
  action: Action<T>
): action is NamedAction<T> => {
  return (action as NamedAction<T>)[$name] != null;
};

export class Store<T extends {} = {}> extends EventTarget {
  #state: T;
  #verbose: boolean;

  constructor(initialState: T, options: StoreOptions<T> = {}) {
    super();
    this.#state = initialState;
    this.#verbose = !!options.verbose;

    const { middleware } = options;
    let store: Store<T> = this;

    if (middleware != null) {
      for (const ware of middleware) {
        store = ware(store);
      }
    }

    return store;
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
      const name = isNamedAction(action) ? action[$name] : 'ANONYMOUS';
      console.warn(`Action<${name}>`, newState);
    }

    this.#state = newState;
    this.dispatchEvent(new CustomEvent('state-change'));
  }
}
