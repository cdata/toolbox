// Adapted from https://github.com/lukeed/uid
// Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
// @license MIT
const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345789';
const alphabetSize = alphabet.length;

/**
 * Generate a unique ID. This is not guaranteed to be optimally fast, nor
 * is it strongly gauranteed not to collide with itself. But, you can set the
 * length of the ID, it uses characters from a reasonably large alphabet and
 * it is reasonably fast. In other words, it is good enough most of the time.
 */
export const uid = (length: number = 16) => {
  let id = '';
  while (length--) {
    id += alphabet[(Math.random() * alphabetSize) | 0];
  }
  return id;
};
