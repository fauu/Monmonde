import * as PIXI from "pixi.js";

interface IDisplayTile {
  sprite: PIXI.Sprite;
}

export class DisplayTileMapLayer {

  private width: number;
  private height: number;
  private tileSize: number;
  private tiles: IDisplayTile[][];
  private tileset: any;
  private scale: number;

  private _container: PIXI.Container;
  public get container() {
    return this._container;
  }

  public constructor(tileset: any, size: [number, number], tileSize: number, scale: number) {
    this._container = new PIXI.Container();
    this.width = size[0];
    this.height = size[1];
    this.tileSize = tileSize;
    this.scale = scale;

    this.tiles = [];
    for (let x = 0; x < this.width; x++) {
      this.tiles[x] = [];
      for (let y = 0; y < this.height; y++) {
        const sprite = new PIXI.Sprite();
        sprite.setTransform(x * this.scale * this.tileSize, y * this.scale * this.tileSize, 2, 2);

        this.tiles[x][y] = { sprite };

        this._container.addChild(sprite);
      }
    }

    this.tileset = tileset;
  }

  public update(map: number[][], position: [number, number]) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const dx = -((this.width - 1) / 2) + x;
        const dy = -((this.height - 1) / 2) + y;
        const mapPosX = position[0] + dx;
        const mapPosY = position[1] + dy;
        if (mapPosY < 0 || mapPosY > map[0].length || mapPosX < 0 || mapPosX > map.length) {
          continue;
        }

        const tilesetTileNo = map[position[0] + dx][position[1] + dy];
        this.tiles[x][y].sprite.texture = this.tileset[`tile_${tilesetTileNo}.png`];
      }
    }
  }

}
