export interface ITileGfxDefitinion {
  name: string;
  tilesetName: string;
  surfaceTypeId: number;
}

// TODO: Load from a file
export const tileDefinitions: ITileGfxDefitinion[] = [
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

export type TileGfxDict = { [surfaceTypeId: number]: number[] };

const generateTileGfxDict = (tileGfxDefinitions: ITileGfxDefitinion[]) => {
  const tileGfxDict: TileGfxDict = {}

  for (let i = 0; i < tileGfxDefinitions.length; i++) {
    const tilesetTileGfxDefitinion = tileGfxDefinitions[i];
    const surfaceTypeId = tilesetTileGfxDefitinion.surfaceTypeId;

    if (!tileGfxDict[surfaceTypeId]) {
      tileGfxDict[surfaceTypeId] = [];
    }
    tileGfxDict[surfaceTypeId].push(i);
  }

  return tileGfxDict;
}

export const tileGfxDict: TileGfxDict = generateTileGfxDict(tileDefinitions);

export const _generateTileGfxDict = generateTileGfxDict;
