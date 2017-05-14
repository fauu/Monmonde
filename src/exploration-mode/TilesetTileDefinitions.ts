export interface ITileDefinition {
  name: string;
  tilesetName: string;
  surfaceTypeId: number;
}

// TODO: Load from a file
export const tilesetTileDefinitions: ITileDefinition[] = [
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
]

export type TilesetTilesDict = { [surfaceTypeId: number]: number[] };

const generateTilesetTilesDict = (tilesetTileDefinitions: ITileDefinition[]) => {
  const tilesetTilesDict: TilesetTilesDict = {}

  for (let i = 0; i < tilesetTileDefinitions.length; i++) {
    const tilesetTileDefinition = tilesetTileDefinitions[i];
    const surfaceTypeId = tilesetTileDefinition.surfaceTypeId;

    if (!tilesetTilesDict[surfaceTypeId]) {
      tilesetTilesDict[surfaceTypeId] = [];
    }
    tilesetTilesDict[surfaceTypeId].push(i);
  }

  return tilesetTilesDict;
}

export const tilesetTilesDict: TilesetTilesDict = generateTilesetTilesDict(tilesetTileDefinitions);

export const _generateTilesetTilesDict = generateTilesetTilesDict;