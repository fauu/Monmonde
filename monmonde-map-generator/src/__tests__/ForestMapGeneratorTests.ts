import { BitMap, ForestMapGenerator } from "../ForestMapGenerator";

describe("ForestMapGenerator", () => {
  it("should generate tree bitmap of correct size", () => {
    const bitMapSize = 4;

    const instance = new ForestMapGenerator((_) => 2);

    const bitMap: BitMap = instance._generateTreeBitMap(bitMapSize, [0, 0], []);

    expect(bitMap).toHaveLength(4);
    expect(bitMap[0]).toBeDefined();
    expect(bitMap[0]).toHaveLength(4);
  });

  it("should generate tree bitmap with '0's and at least one '1'", () => {
    const bitMapSize = 4;

    const instance = new ForestMapGenerator((_) => 2);

    const bitMap: BitMap = instance._generateTreeBitMap(bitMapSize, [0, 0], []);

    expect(hasZerosAndAtLeastOneOne(bitMap)).toBeTruthy();
  });

});

const hasZerosAndAtLeastOneOne = (array: number[][]): boolean => {
  let foundOne = false;
  for (const row of array) {
    for (const cell of row) {
      if (cell === 1) {
        foundOne = true;
      } else if (cell !== 0) {
        return false;
      }
    }
  }

  return foundOne;
};
