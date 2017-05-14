export type MapLayer = number[][];

export class MapChunk {

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

  private _surfaceLayer: MapLayer;
  public get surfaceLayer(): MapLayer {
    return this._surfaceLayer;
  }
  public set surfaceLayer(value: MapLayer) {
    this._surfaceLayer = value;
  }

  private _objectLayer: MapLayer;
  public get objectLayer(): MapLayer {
    return this._objectLayer;
  }
  public set objectLayer(value: MapLayer) {
    this._objectLayer = value;
  }

  public constructor(size: number) {
    this._size = size;
  }

}
