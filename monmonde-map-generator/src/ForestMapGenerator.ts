import { surfaceTypes } from "./SurfaceTypes";
import { randomElement } from "monmonde-utils";
import { tilesetTilesDict } from "./TilesetTileDefinitions";
import { IMapGenerator } from "./IMapGenerator";
import { MapLayer } from "./MapChunk";
import * as PoissonDiskSampling from "poisson-disk-sampling";
import { mapObjectSpritesDict, MapObjectSpritesDict } from "./MapObjectSpriteDefinitions";

export type Bit = 0 | 1;
export type BitMap = Array<Array<Bit>>;

export type TreeObjectTypePicker = (position: [number, number]) => number;

export class ForestMapGenerator implements IMapGenerator {

  // TODO: Derive from input (noise or any other)
  public static readonly treeSamplerParameters = {
    minDistance: 10,
    maxDistance: 20,
    maxTries: 5,
  }

  private treeObjectTypePicker: TreeObjectTypePicker;

  public constructor(treeObjectTypePicker: TreeObjectTypePicker) {
    this.treeObjectTypePicker = treeObjectTypePicker;
  }

  public getSurfaceTypeAt(position: [number, number]): number {
    return 1;
  }

  public getObjectLayer(
      size: number, 
      startCoords: [number, number], 
      logicalSurfaceLayer: MapLayer): MapLayer {
    const treeBitMap = this.generateTreeBitMap(size, startCoords, logicalSurfaceLayer);

    const logicalObjectLayer: MapLayer = [];
    for (let x = 0; x < size; x++) {
      logicalObjectLayer[x] = [];
      for (let y = 0; y < size; y++) {
        const position: [number, number] = [startCoords[0] + x, startCoords[1] + y]
        if (treeBitMap[x][y] === 1) {
          logicalObjectLayer[x][y] = this.treeObjectTypePicker(position);
        } else {
          logicalObjectLayer[x][y] = -1;
        }
      }
    }

    return logicalObjectLayer;
  }

  private generateTreeBitMap(size: number, startCoords: [number, number], logicalSurfaceLayer: MapLayer): BitMap {
    const pds = new PoissonDiskSampling(
        [size, size], 
        ForestMapGenerator.treeSamplerParameters.minDistance,
        ForestMapGenerator.treeSamplerParameters.maxDistance,
        ForestMapGenerator.treeSamplerParameters.maxTries);
    const points = pds.fill();

    for (let i = 0; i < points.length; i++) {
      points[i][0] = Math.floor(points[i][0]);
      points[i][1] = Math.floor(points[i][1]);
    }

    const row = Array.apply(null, new Array(size)).map(() => 0);
    const bitMap = Array.apply(null, new Array(size)).map(() => row);
    for (const point of points) {
      bitMap[point[0]][point[1]] = 1;
    }

    return bitMap;
  }

  public _generateTreeBitMap = this.generateTreeBitMap;

}