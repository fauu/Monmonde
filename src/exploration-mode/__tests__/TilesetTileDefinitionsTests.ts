import { _generateTilesetTilesDict, TilesetTilesDict, ITileDefinition } from "../TilesetTileDefinitions"

it("should correctly generate tileset tile dictionary", () => {
  const tilesetTileDefinitions: ITileDefinition[] = [
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

  const tilesetTilesDict = _generateTilesetTilesDict(tilesetTileDefinitions);

  expect(tilesetTilesDict).toEqual({
    1: [0, 1, 2],
    3: [3],
  });

});
