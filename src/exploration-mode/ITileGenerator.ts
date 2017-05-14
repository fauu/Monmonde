export interface ITileGenerator {

  generateSurfaceTypeAt(position: [number, number]): number;
  
  generateGroundTilemapTileAt(position: [number, number], surfaceTypeId: number): number;

}