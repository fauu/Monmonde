import { MapChunk, MapLayer } from "./MapChunk";
import { tilesetTileDefinitions } from "./TilesetTileDefinitions";
import { ITileGenerator } from "./ITileGenerator";
import { IMapObjectGenerator } from "./IMapObjectGenerator";

export class MapGenerator {

  private tileGenerator: ITileGenerator;
  private mapObjectGenerator: IMapObjectGenerator;
  private chunkSize: number;

  public constructor(
      tileGenerator: ITileGenerator, 
      mapObjectGenerator: IMapObjectGenerator,
      chunkSize: number) {
    this.tileGenerator = tileGenerator;
    this.mapObjectGenerator = mapObjectGenerator;
    this.chunkSize = chunkSize;
  }

  public generateChunk(position: [number, number]): MapChunk {
    const chunk = new MapChunk(this.chunkSize);

    const chunkStart: [number, number] =
        [position[0] * this.chunkSize, position[1] * this.chunkSize];

    const logicalSurfaceLayer = this.generateLogicalSurfaceLayer(chunkStart);
    chunk.logicalSurfaceLayer = logicalSurfaceLayer;

    const effectiveSurfaceLayer = this.generateEffectiveSurfaceLayer(chunkStart, logicalSurfaceLayer);
    chunk.effectiveSurfaceLayer = effectiveSurfaceLayer;

    const logicalObjectLayer = 
        this.generateLogicalObjectLayer(this.chunkSize, chunkStart, logicalSurfaceLayer);
    chunk.logicalObjectLayer = logicalObjectLayer;

    const effectiveObjectLayer = this.generateEffectiveObjectLayer(chunkStart, logicalObjectLayer);
    chunk.effectiveObjectLayer = effectiveObjectLayer;

    return chunk;
  }

  private generateLogicalSurfaceLayer(startCoords: [number, number]): MapLayer {
    const logicalSurfaceLayer: MapLayer = [];
    for (let x = 0; x < this.chunkSize; x++) {
      logicalSurfaceLayer[x] = [];
      for (let y = 0; y < this.chunkSize; y++) {
        const tilePosition: [number, number] = [startCoords[0] + x, startCoords[1] + y];

        logicalSurfaceLayer[x][y] = this.tileGenerator.generateSurfaceTypeAt(tilePosition);
      }
    }

    return logicalSurfaceLayer;
  }

  private generateEffectiveSurfaceLayer(startCoords: [number, number], logicalSurfaceLayer: MapLayer)
      : MapLayer {
    const effectiveSurfaceLayer: MapLayer = [];
    for (let x = 0; x < this.chunkSize; x++) {
      effectiveSurfaceLayer[x] = [];
      for (let y = 0; y < this.chunkSize; y++) {
        const tilePosition: [number, number] = [startCoords[0] + x, startCoords[1] + y];

        effectiveSurfaceLayer[x][y] = 
            this.tileGenerator.generateSurfaceTilemapTileAt(tilePosition, logicalSurfaceLayer[x][y]);
      }
    }

    return effectiveSurfaceLayer;
  }

  private generateLogicalObjectLayer(
      size: number, 
      startCoords: [number, number], 
      logicalSurfaceLayer: MapLayer)
      : MapLayer {
    return this.mapObjectGenerator.generateLogicalObjectLayer(size, startCoords, logicalSurfaceLayer);
  }

  private generateEffectiveObjectLayer(startCoords: [number, number], logicalObjectLayer: MapLayer) {
    const effectiveObjectLayer: MapLayer = [];
    for (let x = 0; x < this.chunkSize; x++) {
      effectiveObjectLayer[x] = [];
      for (let y = 0; y < this.chunkSize; y++) {
        const tilePosition: [number, number] = [startCoords[0] + x, startCoords[1] + y];

        effectiveObjectLayer[x][y] = 
            this.mapObjectGenerator.generateMapObjectSpriteAt(tilePosition, logicalObjectLayer[x][y]);
      }
    }

    return effectiveObjectLayer;
  }
    
}
