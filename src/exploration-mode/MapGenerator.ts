import { MapChunk } from "./MapChunk";
import { ISurfaceGenerator } from "./ISurfaceGenerator";
import { SurfaceTypeMap, TilesetTileMap } from "./MapChunk";
import { tilesetTileDefinitions } from "./TilesetTileDefinitions";
import { ITileGenerator } from "./ITileGenerator";

export class MapGenerator {

  private tileGenerator: ITileGenerator;
  private chunkSize: number;

  public constructor(tileGenerator: ITileGenerator, chunkSize: number) {
    this.tileGenerator = tileGenerator;
    this.chunkSize = chunkSize;
  }

  public generateChunk(position: [number, number]): MapChunk {
    const chunk = new MapChunk(this.chunkSize);

    const chunkStart: [number, number] =
        [position[0] * this.chunkSize, position[1] * this.chunkSize];

    const surfaceTypeMap = this.generateSurfaceTypeMap(chunkStart);
    chunk.surfaceTypeMap = surfaceTypeMap;

    const groundMap = this.generateGroundMap(chunkStart, surfaceTypeMap);
    chunk.groundMap = groundMap;

    return chunk;
  }

  private generateSurfaceTypeMap(startCoords: [number, number]): SurfaceTypeMap {
    const surfaceTypeMap: SurfaceTypeMap = [];
    for (let x = 0; x < this.chunkSize; x++) {
      surfaceTypeMap[x] = [];
      for (let y = 0; y < this.chunkSize; y++) {
        const tilePosition: [number, number] = [startCoords[0] + x, startCoords[1] + y];

        surfaceTypeMap[x][y] = this.tileGenerator.generateSurfaceTypeAt(tilePosition);
      }
    }

    return surfaceTypeMap;
  }

  private generateGroundMap(startCoords: [number, number], surfaceTypeMap: SurfaceTypeMap)
      : TilesetTileMap {
    const groundMap: Array<Array<number>> = [];
    for (let x = 0; x < this.chunkSize; x++) {
      groundMap[x] = [];
      for (let y = 0; y < this.chunkSize; y++) {
        const tilePosition: [number, number] = [startCoords[0] + x, startCoords[1] + y];

        groundMap[x][y] = 
            this.tileGenerator.generateGroundTilemapTileAt(tilePosition, surfaceTypeMap[x][y]);
      }
    }

    return groundMap;
  }
    
}
