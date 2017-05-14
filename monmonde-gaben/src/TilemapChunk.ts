export type TilemapLayer = number[][];

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

}
