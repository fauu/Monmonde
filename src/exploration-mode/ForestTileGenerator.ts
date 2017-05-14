import { surfaceTypes } from "./SurfaceTypes";
import { randomElement } from "../RandomUtils";
import { tilesetTilesDict } from "./TilesetTileDefinitions";
import { ITileGenerator } from "./ITileGenerator";

export class ForestTileGenerator implements ITileGenerator {

  public generateSurfaceTypeAt(position: [number, number]): number {
    return surfaceTypes["grass"];
  }

  public generateGroundTilemapTileAt(position: [number, number], surfaceTypeId: number): number {
    return randomElement(tilesetTilesDict[surfaceTypeId]);
  }

}