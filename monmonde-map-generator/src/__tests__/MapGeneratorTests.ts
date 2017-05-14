import { IMapGenerator } from "../IMapGenerator";
import { MapChunk } from "../MapChunk";
import { MapChunkGenerator } from "../MapChunkGenerator";

const MockMapGenerator = jest.fn<IMapGenerator>(() => ({

  getObjectLayer: jest.fn((position: [number, number], surfaceTypeId: number): number => {
    return position[0] + position[1] + surfaceTypeId;
  }),

  getSurfaceTypeAt: jest.fn((position: [number, number]): number => {
    return 1;
  }),

}));

describe("MapGenerator", () => {

  it("should generate map chunk", () => {
    const chunkSize = 4;
    const chunkNumTiles = chunkSize * chunkSize;
    const chunkPosition: [number, number] = [1, 1];
    const mockTileGenerator = new MockMapGenerator();

    const instance = new MapChunkGenerator(mockTileGenerator);
    const chunk = instance.generateChunk(chunkPosition, chunkSize);

    expect(mockTileGenerator.getSurfaceTypeAt)
        .toHaveBeenCalledTimes(chunkNumTiles);

    expect(mockTileGenerator.getObjectLayer)
        .toHaveBeenCalledTimes(chunkNumTiles);

    expect(chunk.surfaceLayer).toEqual([
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ]);

    const chunkStart: [number, number] =
        [chunkPosition[0] * chunkSize, chunkPosition[1] * chunkSize];
    const s = chunkStart[0] + chunkStart[1] + 1;
    expect(chunk.objectLayer).toEqual([
      [s, s + 1, s + 2, s + 3],
      [s + 1, s + 2, s + 3, s + 4],
      [s + 2, s + 3, s + 4, s + 5],
      [s + 3, s + 4, s + 5, s + 6],
    ]);
  });

});
