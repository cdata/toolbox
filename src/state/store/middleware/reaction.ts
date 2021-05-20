import { Selector } from 'reselect';
import type { ActionCreator, Store } from '../../store.js';

export interface Reaction<T, U extends any = unknown> {
  selector: Selector<T, U>;
  reactor: ActionCreator<T, [U]>;
}

export type Reactions<T, U extends any = any> = Reaction<T, U>[];

export interface EqualityCheck {
  (a: any, b: any): boolean;
}

const defaultEqualityCheck: EqualityCheck = (a, b) => a === b;

export const reactions = <T extends {}>(
  reactions: Reactions<T>,
  isEqual: EqualityCheck = defaultEqualityCheck
) => {
  return (store: Store<T>): Store<T> => {
    const selectorValueCache = new WeakMap<Selector<T, unknown>, unknown>();

    store.addEventListener('state-change', async () => {
      for (const reaction of reactions) {
        const { selector, reactor } = reaction;
        const selectedValue = selector(store.state);
        const cachedValue = selectorValueCache.get(selector);

        if (isEqual(selectedValue, cachedValue)) {
          continue;
        }

        selectorValueCache.set(selector, selectedValue);

        await store.dispatch(reactor(selectedValue));
      }
    });

    return store;
  };
};
