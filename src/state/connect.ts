import type {
  Store,
  ActionCreator,
  Action,
  SelfDispatchingActionCreator,
} from './store.js';
import {
  ConnectableInterface,
  StoreRequestedDetails,
  StoreConnectedDetails,
} from './types.js';
import type { Constructor } from '../types.js';
import type { Selector } from 'reselect';

export const $propertyMap = Symbol('propertyMap');

export interface ConnectedInterface<T extends {}>
  extends ConnectableInterface<T>,
    EventTarget {
  [$propertyMap]: Map<string, Selector<T, unknown>>;
}

export const connect = <T extends {}>() => <U extends Constructor<any>>(
  SuperClass: U
): U & Constructor<ConnectedInterface<T>> => {
  class Connected extends SuperClass {
    get store() {
      return this.#store;
    }

    #store: Store<T> | null = null;

    #updateState = () => {
      if (this.#store == null) {
        return;
      }

      const state = this.#store.state;

      // Much hand-waving ensues:
      for (const [
        property,
        selector,
      ] of ((this as unknown) as ConnectedInterface<T>)[
        $propertyMap
      ].entries()) {
        ((this as unknown) as { [index: string]: unknown })[
          property
        ] = selector(state);
      }
    };

    protected async dispatch(action: Action<T>): Promise<void> {
      return this.#store?.dispatch(action);
    }

    connectStore(store: Store<T>) {
      if (this.#store != null) {
        if (this.#store !== store) {
          this.disconnectStore();
        } else {
          return;
        }
      }

      this.#store = store;
      this.#store.addEventListener('state-change', this.#updateState);
      this.#updateState();

      this.dispatchEvent(
        new CustomEvent<StoreConnectedDetails<T>>('store-connected', {
          detail: { store },
          bubbles: false,
          composed: false,
        })
      );
    }

    disconnectStore() {
      if (this.#store == null) {
        return;
      }

      this.#store.removeEventListener('state-change', this.#updateState);
      this.#store = null;
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();

      console.log('dispatch store-request');

      this.dispatchEvent(
        new CustomEvent<StoreRequestedDetails<T>>('store-requested', {
          detail: { requestor: this },
          bubbles: true,
          composed: true,
        })
      );
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();

      this.disconnectStore();
    }
  }

  Connected.prototype[$propertyMap] = new Map<string, Selector<T, unknown>>();

  return Connected;
};

const storeConnects = async <T extends {}>(
  target: ConnectedInterface<T>
): Promise<Store<T>> => {
  if (target.store == null) {
    await new Promise((resolve) => {
      target.addEventListener('store-connected', resolve, { once: true });
    });
  }

  return (target.store as unknown) as Store<T>;
};

export const wrap = <
  T extends {},
  U extends ConnectedInterface<T>,
  V extends ActionCreator<any, any[]>,
  W extends any[] = V extends ActionCreator<T, infer X> ? X : any[]
>(
  target: U,
  actionCreator: ActionCreator<T, W>
): SelfDispatchingActionCreator<W> => async (...args: W) => {
  const store = await storeConnects(target);
  await store.dispatch(actionCreator(...args));
};
