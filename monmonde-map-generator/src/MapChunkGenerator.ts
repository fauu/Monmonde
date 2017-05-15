import { IMapGenerator } from "./IMapGenerator";
import { MapChunk, MapLayer } from "./MapChunk";

export class MapChunkGenerator {

  private mapGenerator: IMapGenerator;

  public constructor(mapGenerator: IMapGenerator) {
    this.mapGenerator = mapGenerator;
  }

  public generateChunk(position: [number, number], size: number): MapChunk {
    const chunk = new MapChunk(size);

    chunk.position = position;

    const chunkStart: [number, number] = [position[0] * size, position[1] * size];

    const surfaceLayer = this.generateSurfaceLayer(size, chunkStart);
    chunk.surfaceLayer = surfaceLayer;

    const objectLayer = this.generateObjectLayer(size, chunkStart, surfaceLayer);
    chunk.objectLayer = objectLayer;

    return chunk;
  }

  private generateSurfaceLayer(size: number, startCoords: [number, number]): MapLayer {
    const surfaceLayer: MapLayer = [];
    for (let y = 0; y < size; y++) {
      surfaceLayer[y] = [];
      for (let x = 0; x < size; x++) {
        const tilePosition: [number, number] = [startCoords[0] + x, startCoords[1] + y];

        surfaceLayer[y][x] = this.mapGenerator.getSurfaceTypeAt(tilePosition);
      }
    }

    return surfaceLayer;
  }

  private generateObjectLayer(
      size: number,
      startCoords: [number, number],
      logicalSurfaceLayer: MapLayer): MapLayer {
    return this.mapGenerator.getObjectLayer(size, startCoords, logicalSurfaceLayer);
  }

}
