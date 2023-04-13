// chooses a random element from an array
export const chooseRandom = <T, A extends readonly T[] | T[]>(
  array: A
): A[number] => {
  return array[Math.floor(Math.random() * array.length)];
};
