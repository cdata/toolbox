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

/**
 * A class mixin that produces a "connected" extension to a given HTMLElement.
 *
 * When a "connected" element attaches to a document, it queries for a store
 * provider by dispatching a bubbling event. If a provider is listening, it
 * responds with the instance of the store to be used.
 *
 * Any pending self-dispatching actions will dispatch as soon as the store is
 * associated with the "connected" element.
 */
export const connect = <T extends {}>() => <
  U extends Constructor<
    EventTarget & {
      connectedCallback?(): void;
      disconnectedCallback?(): void;
    }
  >
>(
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

  return (Connected as unknown) as U & Constructor<ConnectedInterface<T>>;
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

/**
 * Create a wrapped version of an arbitrary ActionCreator that will
 * self-dispatch to the store associated with the context that the ActionCreator
 * is called with. Note that such a wrapped ActionCreator must be called with
 * a context that expresses the behavior of a ConnectedInterface.
 *
 * Example usage:
 *
 * import {someActionCreator} from './actions.js';
 *
 * class ConnectedFoo extends connect()(EventTarget) {
 *   #someActionCreator = selfDispatch(someActionCreator);
 *
 *   onEvent() {
 *     // This will automatically dispatch to the store
 *     // when this instance is connected to it:
 *     this.#someActionCreator(appropriate, args);
 *   }
 * }
 */
export const selfDispatch = <
  T extends {},
  U extends ConnectedInterface<T>,
  V extends ActionCreator<any, any[]>,
  W extends any[] = V extends ActionCreator<T, infer X> ? X : any[]
>(
  actionCreator: ActionCreator<T, W>
): SelfDispatchingActionCreator<W> =>
  async function (this: U, ...args: W) {
    const store = await storeConnects(this);
    await store.dispatch(actionCreator(...args));
  };
