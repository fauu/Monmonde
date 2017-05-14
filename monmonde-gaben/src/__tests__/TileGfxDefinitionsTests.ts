import { _generateTileGfxDict, ITileGfxDefitinion } from "../TileGfxDefinitions";

it("should generate tileset tile dictionary", () => {
  const tilesetTileDefinitions: ITileGfxDefitinion[] = [
    {
      name: "grass1",
      surfaceTypeId: 1,
      tilesetName: "tileset",
    },
    {
      name: "grass2",
      surfaceTypeId: 1,
      tilesetName: "tileset",
    },
    {
      name: "grass3",
      surfaceTypeId: 1,
      tilesetName: "tileset",
    },
    {
      name: "dirt1",
      surfaceTypeId: 3,
      tilesetName: "tileset2",
    },
  ];

  const tilesetTilesDict = _generateTileGfxDict(tilesetTileDefinitions);

  expect(tilesetTilesDict).toEqual({
    1: [0, 1, 2],
    3: [3],
  });
});
