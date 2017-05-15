export interface ITileGfxDefitinion {
  name: string;
  tilesetName: string;
  surfaceTypeId: number;
}

// TODO: Load from a file
export const tileGfxDefinitions: ITileGfxDefitinion[] = [
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
];

export interface ITileGfxDict { [surfaceTypeId: number]: number[]; }

const generateTileGfxDict = (defs: ITileGfxDefitinion[]) => {
  const tileGfxDict: ITileGfxDict = {};

  for (let i = 0; i < defs.length; i++) {
    const tilesetTileGfxDefitinion = defs[i];
    const surfaceTypeId = tilesetTileGfxDefitinion.surfaceTypeId;

    if (!tileGfxDict[surfaceTypeId]) {
      tileGfxDict[surfaceTypeId] = [];
    }
    tileGfxDict[surfaceTypeId].push(i);
  }

  return tileGfxDict;
};

export const tileGfxDict: ITileGfxDict = generateTileGfxDict(tileGfxDefinitions);

export const _generateTileGfxDict = generateTileGfxDict;
