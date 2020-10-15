export const nextEvent = <T extends Event>(
  target: EventTarget,
  type: string
): Promise<T> => {
  return new Promise<T>((resolve) => {
    target.addEventListener(
      type,
      (event: unknown) => {
        resolve(event as T);
      },
      { once: true }
    );
  });
};
