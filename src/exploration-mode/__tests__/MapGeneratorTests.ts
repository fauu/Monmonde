import { MapGenerator } from "../MapGenerator";
import { MapChunk } from "../MapChunk";
import { ITileGenerator } from "../ITileGenerator";

const MockTileGenerator = jest.fn<ITileGenerator>(() => ({
  generateSurfaceTypeAt: jest.fn((position: [number, number]): number => {
    return 1;
  }),
  generateSurfaceTilemapTileAt: jest.fn((position: [number, number], surfaceTypeId: number): number => {
    return position[0] + position[1] + surfaceTypeId;
  }),
}));

describe("MapGenerator", () => {

  it("should generate map chunk", () => {
    const chunkSize = 4;
    const chunkNumTiles = chunkSize * chunkSize;
    const chunkPosition: [number, number] = [1, 1];
    const mockTileGenerator = new MockTileGenerator();

    const instance = new MapGenerator(mockTileGenerator, chunkSize);
    const chunk = instance.generateChunk(chunkPosition);

    expect(mockTileGenerator.generateSurfaceTypeAt)
        .toHaveBeenCalledTimes(chunkNumTiles);

    expect(mockTileGenerator.generateSurfaceTilemapTileAt)
        .toHaveBeenCalledTimes(chunkNumTiles);

    expect(chunk.logicalSurfaceLayer).toEqual([
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ]);

    const chunkStart: [number, number] =
        [chunkPosition[0] * chunkSize, chunkPosition[1] * chunkSize];
    const s = chunkStart[0] + chunkStart[1] + 1;
    expect(chunk.effectiveSurfaceLayer).toEqual([
      [s, s + 1, s + 2, s + 3],
      [s + 1, s + 2, s + 3, s + 4],
      [s + 2, s + 3, s + 4, s + 5],
      [s + 3, s + 4, s + 5, s + 6],
    ]);
  });

});