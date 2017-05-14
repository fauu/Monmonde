export interface ITileGenerator {

  generateSurfaceTypeAt(position: [number, number]): number;
  
  generateSurfaceTilemapTileAt(position: [number, number], surfaceTypeId: number): number;

}