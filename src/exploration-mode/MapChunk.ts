export type SurfaceTypeMap = Array<Array<number>>;
export type TilesetTileMap = Array<Array<number>>;

export class MapChunk {

  private size: number;

  private _surfaceTypeMap: SurfaceTypeMap;
  public get surfaceTypeMap(): SurfaceTypeMap {
    return this._surfaceTypeMap;
  }
  public set surfaceTypeMap(value: SurfaceTypeMap) {
    this._surfaceTypeMap = value;
  }

  private _groundMap: TilesetTileMap;
  public get groundMap(): TilesetTileMap {
    return this._groundMap;
  }
  public set groundMap(value: TilesetTileMap) {
    this._groundMap = value;
  }

  public constructor(size: number) {
    this.size = size;
  }

}