// Adapted from https://github.com/lukeed/uid
// Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
// @license MIT
const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345789';
const alphabetSize = alphabet.length;

export const uid = (length: number = 16) => {
  let id = '';
  while (length--) {
    id += alphabet[(Math.random() * alphabetSize) | 0];
  }
  return id;
};
