import { MapChunk, MapLayer } from "monmonde-map-generator";
import { randomElement } from "monmonde-utils";
import { mapObjectGfxDict } from "./MapObjectGfxDefinitions";
import { tileGfxDict } from "./TileGfxDefinitions";
import { TilemapChunk, TilemapLayer } from "./TilemapChunk";

export class TilemapChunkGenerator {

  public generateTilemapChunk(logicalMapChunk: MapChunk): TilemapChunk {
    const tilemapChunk = new TilemapChunk(logicalMapChunk.size);

    const chunkStart: [number, number] =
        [logicalMapChunk.position[0] * logicalMapChunk.size, logicalMapChunk.position[1] * logicalMapChunk.size];

    const surfaceLayer = this.createSurfaceLayer(chunkStart, logicalMapChunk.surfaceLayer);
    tilemapChunk.surfaceLayer = surfaceLayer;

    const objectLayer = this.createObjectLayer(chunkStart, logicalMapChunk.objectLayer);
    tilemapChunk.objectLayer = objectLayer;

    return tilemapChunk;
  }

  private createSurfaceLayer(startCoords: [number, number], logicalSurfaceLayer: MapLayer): MapLayer {
    const surfaceLayer: TilemapLayer = [];
    for (let y = 0; y < logicalSurfaceLayer.length; y++) {
      surfaceLayer[y] = [];
      for (let x = 0; x < logicalSurfaceLayer.length; x++) {
        const tilePosition: [number, number] = [startCoords[0] + x, startCoords[1] + y];

        surfaceLayer[y][x] = this.createSurfaceTileAt(tilePosition, logicalSurfaceLayer[y][x]);
      }
    }

    return surfaceLayer;
  }

  private createObjectLayer(startCoords: [number, number], logicalObjectLayer: MapLayer) {
    const objectLayer: MapLayer = [];
    for (let y = 0; y < logicalObjectLayer.length; y++) {
      objectLayer[y] = [];
      for (let x = 0; x < logicalObjectLayer.length; x++) {
        const tilePosition: [number, number] = [startCoords[0] + x, startCoords[1] + y];

        objectLayer[y][x] = this.createMapObjectSpriteAt(tilePosition, logicalObjectLayer[y][x]);
      }
    }

    return objectLayer;
  }

  private createSurfaceTileAt(position: [number, number], surfaceTypeId: number): number {
    return randomElement(tileGfxDict[surfaceTypeId]);
  }

  private createMapObjectSpriteAt(tilePosition: [number, number], mapObjectTypeId: number): number {
    const mapObjectSpriteIdsForType = mapObjectGfxDict[mapObjectTypeId];

    const mapObjectSpriteId =
        (mapObjectSpriteIdsForType && mapObjectSpriteIdsForType.length > 0)
        ? mapObjectSpriteIdsForType[0]
        : -1;

    return mapObjectSpriteId;
  }

}
