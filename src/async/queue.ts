import { Deferred } from './deferred.js';

export const queue = <T extends any[]>(fn: (...args: T) => unknown) => {
  let taskCompletes = Promise.resolve();

  return async (...args: T) => {
    try {
      await taskCompletes;
    } catch (_) {}
    const task = new Deferred();

    taskCompletes = task.promise;

    const result = await fn(...args);

    task.resolve();

    return result;
  };
};
