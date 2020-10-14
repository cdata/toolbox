import type { Action, Store } from '../../store.js';
import { action } from '../../store.js';

export const getLocation = (): NavigationState['location'] => {
  const { pathname, search, hash } = self.location;

  return {
    pathname,
    search,
    hash,
  };
};

export interface NavigationState {
  location: {
    pathname: string;
    search: string;
    hash: string;
  };
}

export interface NavigateOptions {
  redirect?: boolean;
  title?: string;
}

export const navigate = <T extends NavigationState>(
  url: string,
  options?: NavigateOptions
): Action<T> =>
  action('navigate', (getState) => {
    const redirect = options?.redirect || false;
    const title = options?.title || self.document.title;

    if (redirect) {
      self.history.replaceState(null, title, url);
    } else {
      self.history.pushState(null, title, url);
    }

    return {
      ...getState(),
      location: getLocation(),
    };
  });

export const navigation = <T extends NavigationState>(
  store: Store<T>
): Store<T> => {
  const origin = self.location.origin;

  self.addEventListener(
    'click',
    (event: MouseEvent) => {
      const path = event.composedPath().reverse();

      for (const target of path) {
        if (target instanceof HTMLAnchorElement) {
          if (target.href == null) {
            continue;
          }

          const href = new URL(target.href, self.location.toString());

          if (href.origin === origin) {
            const title = target.dataset.title;
            const redirect = target.hasAttribute('data-redirect');

            event.preventDefault();
            store.dispatch(navigate(href.toString(), { title, redirect }));
            break;
          }
        }
      }
    },
    true
  );

  return store;
};
