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

/**
 * This is a decorator intended to be used in conjunction with a "connected"
 * element (a custom element extended with the connect mixin).
 *
 * The decorator takes a function that receives state and reduces it to some
 * subset of the input. The function is invoked whenever state changes in a
 * meaningful way. This is handy for binding sub-state to LitElement properties
 * in a psuedo-declarative fashion.
 */
export const selector = <T extends {}, U = unknown>(
  selector: Selector<T, U>
) => (target: ConnectedInterface<T>, property: string) => {
  target[$propertyMap].set(property, selector);
};
