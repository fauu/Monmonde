import * as PoissonDiskSampling from "poisson-disk-sampling";
import { IMapGenerator } from "./IMapGenerator";
import { MapLayer } from "./MapChunk";

export type Bit = 0 | 1;
export type BitMap = Bit[][];

export type TreeObjectTypePicker = (position: [number, number]) => number;

export class ForestMapGenerator implements IMapGenerator {

  // TODO: Derive from input (noise or any other)
  public static readonly treeSamplerParameters = {
    maxDistance: 7,
    maxTries: 15,
    minDistance: 3,
  };

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
    for (let y = 0; y < size; y++) {
      logicalObjectLayer[y] = [];
      for (let x = 0; x < size; x++) {
        const position: [number, number] = [startCoords[0] + x, startCoords[1] + y];
        if (treeBitMap[y][x] === 1) {
          logicalObjectLayer[y][x] = this.treeObjectTypePicker(position);
        } else {
          logicalObjectLayer[y][x] = -1;
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
      ForestMapGenerator.treeSamplerParameters.maxTries,
    );
    const points = pds.fill();

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < points.length; i++) {
      points[i][0] = Math.floor(points[i][0]);
      points[i][1] = Math.floor(points[i][1]);
    }

    const row = Array.apply(null, new Array(size)).map(() => 0);
    const bitMap = Array.apply(null, new Array(size)).map(() => row.slice(0));
    for (const point of points) {
      bitMap[point[1]][point[0]] = 1;
    }

    return bitMap;
  }

  // tslint:disable-next-line:member-ordering
  public _generateTreeBitMap = this.generateTreeBitMap;

}
