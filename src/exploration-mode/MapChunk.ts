export type MapLayer = Array<Array<number>>;

export class MapChunk {

  private size: number;

  private _logicalSurfaceLayer: MapLayer;
  public get logicalSurfaceLayer(): MapLayer {
    return this._logicalSurfaceLayer;
  }
  public set logicalSurfaceLayer(value: MapLayer) {
    this._logicalSurfaceLayer = value;
  }

  private _effectiveSurfaceLayer: MapLayer;
  public get effectiveSurfaceLayer(): MapLayer {
    return this._effectiveSurfaceLayer;
  }
  public set effectiveSurfaceLayer(value: MapLayer) {
    this._effectiveSurfaceLayer = value;
  }

  private _logicalObjectLayer: MapLayer;
  public get logicalObjectLayer(): MapLayer {
    return this._logicalObjectLayer;
  }
  public set logicalObjectLayer(value: MapLayer) {
    this._logicalObjectLayer = value;
  }

  private _effectiveObjectLayer: MapLayer;
  public get effectiveObjectLayer(): MapLayer {
    return this._effectiveObjectLayer;
  }
  public set effectiveObjectLayer(value: MapLayer) {
    this._effectiveObjectLayer = value;
  }

  public constructor(size: number) {
    this.size = size;
  }

}