import { Store } from "./store.js";
import { StoreRequestedDetails } from "./types.js";

export const provide = <T extends EventTarget, U extends {} = {}>(
  scope: T,
  store: Store<U>
) => {
  const connectStore = (event: CustomEvent<StoreRequestedDetails<U>>) => {
    console.log("Receive store requested");
    const { requestor } = event.detail;
    event.stopImmediatePropagation();
    requestor.connectStore(store);
  };

  console.log("Listening for store requests..");
  scope.addEventListener("store-requested", connectStore as EventListener);
};
