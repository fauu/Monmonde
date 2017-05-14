import { _generateTileGfxDict, ITileGfxDefitinion } from "../TileGfxDefinitions";

it("should generate tileset tile dictionary", () => {
  const tilesetTileDefinitions: ITileGfxDefitinion[] = [
    {
      name: "grass1",
      tilesetName: "tileset",
      surfaceTypeId: 1,
    }, 
    {
      name: "grass2",
      tilesetName: "tileset",
      surfaceTypeId: 1,
    }, 
    {
      name: "grass3",
      tilesetName: "tileset",
      surfaceTypeId: 1,
    }, 
    {
      name: "dirt1",
      tilesetName: "tileset2",
      surfaceTypeId: 3
    }
  ];

  const tilesetTilesDict = _generateTileGfxDict(tilesetTileDefinitions);

  expect(tilesetTilesDict).toEqual({
    1: [0, 1, 2],
    3: [3],
  });
});
