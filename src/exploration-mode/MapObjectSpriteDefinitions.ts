export interface IMapObjectSpriteDefinition {
  name: string;
  mapObjectTypeId: number;
}

// TODO: Load from a file
export const mapObjectSpriteDefinitions: IMapObjectSpriteDefinition[] = [
  {
    name: "pinetree1",
    mapObjectTypeId: 2,
  }
]

export type MapObjectSpritesDict = { [mapObjectTypeId: number]: number[] };

const generateMapObjectSpritesDict = 
    (mapObjectSpriteDefinitions: IMapObjectSpriteDefinition[])
    : MapObjectSpritesDict => {
  const mapObjectSpritesDict: MapObjectSpritesDict = {}

  for (let i = 0; i < mapObjectSpriteDefinitions.length; i++) {
    const tilesetTileDefinition = mapObjectSpriteDefinitions[i];
    const mapObjectTypeId = tilesetTileDefinition.mapObjectTypeId;

    if (!mapObjectSpritesDict[mapObjectTypeId]) {
      mapObjectSpritesDict[mapObjectTypeId] = [];
    }
    mapObjectSpritesDict[mapObjectTypeId].push(i);
  }

  return mapObjectSpritesDict;
}

export const mapObjectSpritesDict: MapObjectSpritesDict =
    generateMapObjectSpritesDict(mapObjectSpriteDefinitions);

export const _generateMapObjectSpritesDict = generateMapObjectSpritesDict;