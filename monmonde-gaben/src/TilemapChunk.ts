import { mapObjectGfxDefinitions } from "./MapObjectGfxDefinitions";
import { tileGfxDefinitions } from "./TileGfxDefinitions";

export type TilemapLayer = number[][];

export interface ITilemapChunkDependencies {
  tilesets: string[];
  sprites: string[];
}

export class TilemapChunk {

  private _size: number;
  public get size(): number {
    return this._size;
  }
  public set size(value: number) {
    this._size = value;
  }

  private _position: [number, number];
  public get position(): [number, number] {
    return this._position;
  }
  public set position(value: [number, number]) {
    this._position = value;
  }

  private _surfaceLayer: TilemapLayer;
  public get surfaceLayer(): TilemapLayer {
    return this._surfaceLayer;
  }
  public set surfaceLayer(value: TilemapLayer) {
    this._surfaceLayer = value;
  }

  private _objectLayer: TilemapLayer;
  public get objectLayer(): TilemapLayer {
    return this._objectLayer;
  }
  public set objectLayer(value: TilemapLayer) {
    this._objectLayer = value;
  }

  public constructor(size: number) {
    this.size = size;
  }

  public get dependencies(): ITilemapChunkDependencies {
    const dependencies: ITilemapChunkDependencies = {
      sprites: [],
      tilesets: [],
    };

    for (const row of this.surfaceLayer) {
      for (const tileGfxIdx of row) {
        const tilesetName = tileGfxDefinitions[tileGfxIdx].tilesetName;
        if (dependencies.tilesets.indexOf(tilesetName) === -1) {
          dependencies.tilesets.push(tilesetName);
        }
      }
    }

    for (const row of this.objectLayer) {
      for (const objectGfxIdx of row) {
        if (objectGfxIdx === -1) {
          continue;
        }

        const spriteName = mapObjectGfxDefinitions[objectGfxIdx].name;
        if (dependencies.sprites.indexOf(spriteName) === -1) {
          dependencies.sprites.push(spriteName);
        }
      }
    }

    return dependencies;
  }

}
