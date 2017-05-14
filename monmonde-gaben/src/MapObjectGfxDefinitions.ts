export interface IMapObjectGfxDefinition {
  name: string;
  mapObjectTypeId: number;
}

// TODO: Load from a file
export const mapObjectGfxDefinitions: IMapObjectGfxDefinition[] = [
  {
    name: "pinetree1",
    mapObjectTypeId: 2,
  }
]

export type MapObjectGfxDict = { [mapObjectTypeId: number]: number[] };

const generateMapObjectGfxDict = 
    (mapObjectGfxDefinitions: IMapObjectGfxDefinition[])
    : MapObjectGfxDict => {
  const mapObjectGfxDict: MapObjectGfxDict = {}

  for (let i = 0; i < mapObjectGfxDefinitions.length; i++) {
    const tileGfxDefinition = mapObjectGfxDefinitions[i];
    const mapObjectTypeId = tileGfxDefinition.mapObjectTypeId;

    if (!mapObjectGfxDict[mapObjectTypeId]) {
      mapObjectGfxDict[mapObjectTypeId] = [];
    }
    mapObjectGfxDict[mapObjectTypeId].push(i);
  }

  return mapObjectGfxDict;
}

export const mapObjectGfxDict: MapObjectGfxDict =
    generateMapObjectGfxDict(mapObjectGfxDefinitions);

export const _generateMapObjectGfxDict = generateMapObjectGfxDict;
