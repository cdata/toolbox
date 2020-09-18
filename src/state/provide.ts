import { Store } from './store.js';
import { StoreRequestedDetails } from './types.js';

/**
 * Given an EventTarget, listen for events that request a store and provide
 * a configured store to the originating event dispatcher.
 */
export const provide = <T extends EventTarget, U extends {} = {}>(
  scope: T,
  store: Store<U>
) => {
  const connectStore = (event: CustomEvent<StoreRequestedDetails<U>>) => {
    const { requestor } = event.detail;
    event.stopImmediatePropagation();
    requestor.connectStore(store);
  };

  scope.addEventListener('store-requested', connectStore as EventListener);
};
