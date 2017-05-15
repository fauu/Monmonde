import * as PIXI from "pixi.js";
import { ITileGfxDefitinion, tileGfxDefinitions } from "./TileGfxDefinitions";
import { TilemapLayer } from "./TilemapChunk";
import { PIXIResources } from "./Types";

interface IDisplayTile {
  sprite: PIXI.Sprite;
}

export class TilemapDisplayLayer {

  private resources: PIXIResources;
  private width: number;
  private height: number;
  private tileSize: number;
  private tileScale: number;
  private tiles: IDisplayTile[][];

  private _container: PIXI.Container;
  public get container() {
    return this._container;
  }

  public constructor(resources: PIXIResources, size: [number, number], tileSize: number, tileScale: number) {
    this.resources = resources;
    this._container = new PIXI.Container();
    this.width = size[0];
    this.height = size[1];
    this.tileSize = tileSize;
    this.tileScale = tileScale;

    this.tiles = [];
    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        const sprite = new PIXI.Sprite();
        sprite.setTransform(x * tileScale * tileSize, y * tileScale * tileSize, tileScale, tileScale);

        this.tiles[y][x] = { sprite };

        this._container.addChild(sprite);
      }
    }
  }

  public update(tilemap: TilemapLayer, displayRectStart: [number, number]) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tilePos = [displayRectStart[0] + x, displayRectStart[1] + y];
        if (tilePos[0] < 0 || tilePos[0] >= tilemap.length || tilePos[1] < 0 || tilePos[1] >= tilemap.length) {
          this.tiles[y][x].sprite.visible = false;
          continue;
        }

        const tileGfxIdx = tilemap[tilePos[1]][tilePos[0]];
        const tileGfxDefinition: ITileGfxDefitinion = tileGfxDefinitions[tileGfxIdx];

        const tileset = this.resources[tileGfxDefinition.tilesetName];
        if (tileset.textures) {
          this.tiles[y][x].sprite.visible = true;
          this.tiles[y][x].sprite.texture = tileset.textures[tileGfxDefinition.name];
        } else {
          throw new Error("Tileset not loaded");
        }
      }
    }
  }

}
