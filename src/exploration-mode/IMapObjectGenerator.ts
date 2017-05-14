import { MapLayer } from "./MapChunk";

export interface IMapObjectGenerator {

  generateLogicalObjectLayer(size: number, startCoords: [number, number], logicalSurfaceLayer: MapLayer): MapLayer;

  generateMapObjectSpriteAt(tilePosition: [number, number], mapObjectTypeId: number): number;

}