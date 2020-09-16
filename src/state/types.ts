import { Store } from './store.js';

export interface ConnectableInterface<T extends {}> {
  readonly store: Store<T> | null;
  connectStore(store: Store<T>): void;
  disconnectStore(): void;
}

export interface StoreRequestedDetails<T> {
  requestor: ConnectableInterface<T>;
}

export interface StoreConnectedDetails<T> {
  store: Store<T>;
}
