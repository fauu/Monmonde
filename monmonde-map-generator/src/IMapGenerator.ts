import { MapLayer } from "./MapChunk";

export interface IMapGenerator {

  getSurfaceTypeAt(position: [number, number]): number;

  getObjectLayer(size: number, startCoords: [number, number], logicalSurfaceLayer: MapLayer): MapLayer;

}
