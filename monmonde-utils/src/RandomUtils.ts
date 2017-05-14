export const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomElement = <T>(array: T[]): T => {
  return array[randomInt(0, array.length - 1)];
};
