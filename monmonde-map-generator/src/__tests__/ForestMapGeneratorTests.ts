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

const hasZerosAndAtLeastOneOne = (array: Array<Array<number>>): boolean => {
  let foundOne = false;
  for (let x = 0; x < array.length; x++) {
    for (let y = 0; y < array.length; y++) {
      if (array[x][y] == 1) {
        foundOne = true;
      } else if (array[x][y] != 0) {
        return false;
      }
    }
  }

  return foundOne;
}