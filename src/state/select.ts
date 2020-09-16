import { createSelector, Selector } from 'reselect';
import { ConnectedInterface, $propertyMap } from './connect.js';

const selectPath = <T>(...path: string[]) => (state: unknown) => {
  let finalValue = state;

  for (const property of path) {
    finalValue = (finalValue as { [index: string]: unknown })[property];

    if (finalValue == null) {
      break;
    }
  }

  return finalValue as T;
};

export const select = <U>(...path: string[]) =>
  createSelector(selectPath<U>(...path), (result) => result);

export const selector = <T extends {}, U = unknown>(
  selector: Selector<T, U>
) => (target: ConnectedInterface<T>, property: string) => {
  target[$propertyMap].set(property, selector);
};
