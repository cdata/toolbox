export type Constructor<T> = {
  new (...args: any[]): T;
};

export type ConstructorArguments<T extends unknown[]> = {
  new (...args: T): unknown;
};
