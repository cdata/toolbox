export type EventPredicate<T extends Event> = (event: T) => boolean;

export const nextEvent = <T extends Event>(
    target: EventTarget,
    type: string,
    predicate: EventPredicate<T> = () => true): Promise<T> => {
  return new Promise<T>((resolve) => {
    let handleEvent = (event: unknown) => {
      if (predicate(event as T)) {
        target.removeEventListener(type, handleEvent);
        resolve(event as T);
      }
    };

    target.addEventListener(type, handleEvent);
  });
};
