import { ForestMapGenerator, MapChunkGenerator } from "monmonde-map-generator";
import { ObjectDisplayLayer } from "./ObjectDisplayLayer";
import { TilemapChunk } from "./TilemapChunk";
import { TilemapChunkGenerator } from "./TilemapChunkGenerator";
import { TilemapDisplayLayer } from "./TilemapDisplayLayer";

interface IResourceDescriptor {
  name: string;
  url: string;
}

export class Exploration {

  private static readonly scaling = 2;
  private static readonly tileSize = 16;
  private static readonly displayTileSize = Exploration.scaling * Exploration.tileSize;
  private static readonly displaySize: [number, number] = [1056, 768];
  private static readonly displaySizeInTiles =
      Exploration.displaySize.map((x) => x / Exploration.displayTileSize);

  private tilemapChunk: TilemapChunk;
  private loader: PIXI.loaders.Loader;
  private tilemapDisplayLayer: TilemapDisplayLayer;
  private objectDisplayLayer: ObjectDisplayLayer;

  private displayRectStart: [number, number];
  private get displayRectEnd(): [number, number] {
    return [
      this.displayRectStart[0] + Exploration.displaySizeInTiles[0],
      this.displayRectStart[1] + Exploration.displaySizeInTiles[1],
    ];
  }

  private _container: PIXI.Container;
  public get container(): PIXI.Container {
    return this._container;
  }

  public constructor(loader: PIXI.loaders.Loader) {
    this.loader = loader;
    this._container = new PIXI.Container();
  }

  public init() {
    this.displayRectStart = [10, 10];

    const forestMapGenerator = new ForestMapGenerator((_) => 2);
    const mapGenerator = new MapChunkGenerator(forestMapGenerator);
    const mapChunk = mapGenerator.generateChunk([0, 0], 100);

    const tilemapGenerator = new TilemapChunkGenerator();
    this.tilemapChunk = tilemapGenerator.generateTilemapChunk(mapChunk);

    const resolvedTilemapDependencies: IResourceDescriptor[] = [];
    this.tilemapChunk.dependencies.tilesets.forEach((tilesetName) => {
      resolvedTilemapDependencies.push({
        name: tilesetName,
        url: `../assets/${tilesetName}.json`,
      });
    });
    this.tilemapChunk.dependencies.sprites.forEach((spriteName) => {
      resolvedTilemapDependencies.push({
        name: spriteName,
        url: `../assets/${spriteName}.png`,
      });
    });

    PIXI.loader.add(resolvedTilemapDependencies).load(() => {
      this.tilemapDisplayLayer = new TilemapDisplayLayer(
        this.loader.resources,
        Exploration.displaySizeInTiles,
        Exploration.tileSize,
        Exploration.scaling,
      );
      this.tilemapDisplayLayer.update(this.tilemapChunk.surfaceLayer, this.displayRectStart);
      this._container.addChild(this.tilemapDisplayLayer.container);

      this.objectDisplayLayer = new ObjectDisplayLayer(
        this.loader.resources,
        Exploration.displaySize,
        Exploration.displayTileSize,
        Exploration.scaling,
      );
      this.objectDisplayLayer.setObjectLayer(this.tilemapChunk.objectLayer);
      this.objectDisplayLayer.setDisplayRect(this.displayRectStart, Exploration.displaySize);
      this._container.addChild(this.objectDisplayLayer.container);
    });

    document.onkeydown = (e) => {
      e = e || window.event;

      let panVector: [number, number] = [0, 0];
      switch (e.keyCode) {
        case 87:
          panVector = [0, -1];
          break;
        case 83:
          panVector = [0, 1];
          break;
        case 65:
          panVector = [-1, 0];
          break;
        case 68:
          panVector = [1, 0];
          break;
      }

      if (panVector[0] !== 0 || panVector[1] !== 0) {
        this.handleDisplayPan(panVector);
      }
    };
  }

  private handleDisplayPan(panVector: [number, number]) {
    this.displayRectStart[0] += panVector[0];
    this.displayRectStart[1] += panVector[1];
    this.tilemapDisplayLayer.update(this.tilemapChunk.surfaceLayer, this.displayRectStart);

    panVector[0] = -panVector[0] * Exploration.displayTileSize;
    panVector[1] = -panVector[1] * Exploration.displayTileSize;
    this.objectDisplayLayer.translate(panVector);
  }

}
