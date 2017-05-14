export interface IMapObjectGfxDefinition {
  name: string;
  mapObjectTypeId: number;
}

// TODO: Load from a file
export const mapObjectGfxDefinitions: IMapObjectGfxDefinition[] = [
  {
    mapObjectTypeId: 2,
    name: "pinetree1",
  },
];

export interface IMapObjectGfxDict { [mapObjectTypeId: number]: number[]; }

const generateMapObjectGfxDict = (defs: IMapObjectGfxDefinition[]) : IMapObjectGfxDict => {
  const mapObjectGfxDict: IMapObjectGfxDict = {};

  for (let i = 0; i < defs.length; i++) {
    const tileGfxDefinition = defs[i];
    const mapObjectTypeId = tileGfxDefinition.mapObjectTypeId;

    if (!mapObjectGfxDict[mapObjectTypeId]) {
      mapObjectGfxDict[mapObjectTypeId] = [];
    }
    mapObjectGfxDict[mapObjectTypeId].push(i);
  }

  return mapObjectGfxDict;
};

export const mapObjectGfxDict: IMapObjectGfxDict =
    generateMapObjectGfxDict(mapObjectGfxDefinitions);

export const _generateMapObjectGfxDict = generateMapObjectGfxDict;
