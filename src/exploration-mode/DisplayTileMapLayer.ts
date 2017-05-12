import * as PIXI from "pixi.js";

interface DisplayTile {
  sprite: PIXI.Sprite;  
}

export class DisplayTileMapLayer {

  private _width: number;

  private _height: number;

  private _tileSize: number;

  private _tiles: DisplayTile[][];

  private _tileset: any;

  private _scale: number;

  private _container: PIXI.Container;
  public get container() {
    return this._container;
  }

  public constructor(tileset: any, size: [number, number], tileSize: number, scale: number) {
    this._container = new PIXI.Container();
    this._width = size[0];
    this._height = size[1];
    this._tileSize = tileSize;
    this._scale = scale;

    this._tiles = [];
    for (let x = 0; x < this._width; x++) {
      this._tiles[x] = [];
      for (let y = 0; y < this._height; y++) {
        const sprite = new PIXI.Sprite();
        sprite.setTransform(x * this._scale * this._tileSize, y * this._scale * this._tileSize, 2, 2);
        
        this._tiles[x][y] = { sprite };

        this._container.addChild(sprite);
      }
    }

    this._tileset = tileset;
  }

  public update(map: Array<Array<number>>, position: [number, number]) {
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        const dx = -((this._width - 1) / 2) + x;
        const dy = -((this._height - 1) / 2) + y;
        const mapPosX = position[0] + dx;
        const mapPosY = position[1] + dy;
        if (mapPosY < 0 || mapPosY > map[0].length || mapPosX < 0 || mapPosX > map.length) {
          continue; 
        }

        const tilesetTileNo = map[position[0] + dx][position[1] + dy];
        this._tiles[x][y].sprite.texture = this._tileset[`tile_${tilesetTileNo}.png`];
      }
    }
  }

}