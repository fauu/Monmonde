import * as PIXI from "pixi.js";
import { DisplayTileMapLayer } from "./DisplayTileMapLayer";
import { randomInt } from "../RandomUtils";

import { MapGenerator } from "./MapGenerator";
import { MapChunk } from "./MapChunk";
import { ForestMapGenerator } from "./ForestMapGenerator";

declare var ResizeObserver: any;

export class ExplorationMode {

  private app: PIXI.Application;
  private displayTileMapLayer: DisplayTileMapLayer;
  private map: Array<Array<number>>;
  private playerPos: [number, number];
  private objectContainer: PIXI.Container;
  private playerObject: PIXI.DisplayObject;

  public constructor() {
    this.app = new PIXI.Application();
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  }

  public init(host: HTMLElement) {
    host.appendChild(this.app.view);

    const hostResizeObserver = new ResizeObserver((entries: any) => {
      for (const entry of entries) {
        const {width, height} = entry.contentRect;

        this.app.renderer && this.app.renderer.resize(width, height);
      } 
    })
    
    /***/

    const forestMapGenerator = new ForestMapGenerator((_) => 2);
    const mapGenerator = new MapGenerator(forestMapGenerator, forestMapGenerator, 20);
    const mapChunk = mapGenerator.generateChunk([0, 0]);

    console.log(mapChunk.effectiveSurfaceLayer);
    console.log(mapChunk.effectiveObjectLayer);

    /***/

    this.playerPos = [50, 50];
    
    PIXI.loader.add("tileset", "../assets/tileset.json")
               .add("tree", "../assets/tree.png")
               .add("player", "../assets/player.png");

    PIXI.loader.load((_, resources) => {
      this.initMap(resources["tileset"]);

      this.objectContainer = new PIXI.Container();
      
      const playerSprite = this.initPlayer(resources["player"])
      this.playerObject = playerSprite;
      this.objectContainer.addChild(playerSprite);

      const treeSprite = new PIXI.Sprite(resources["tree"].texture);
      treeSprite.scale = new PIXI.Point(2, 2);
      treeSprite.anchor.set(0, 1);
      treeSprite.position.set(0, 32);
      this.objectContainer.addChild(treeSprite);

      this.app.stage.addChild(this.objectContainer);
    });

    hostResizeObserver.observe(host);

    document.onkeydown = (e) => {
      e = e || window.event;

      let moveRequested: boolean = false;
      
      let moveVector: [number, number] = [0, 0];
      switch (e.keyCode) {
        case 87:
          this.playerPos[1] -= 1;
          moveVector = [0, -1];
          moveRequested = true;
          break;
        case 83:
          this.playerPos[1] += 1;
          moveVector = [0, 1];
          moveRequested = true;
          break;
        case 65:
          this.playerPos[0] -= 1;
          moveVector = [-1, 0];
          moveRequested = true;
          break;
        case 68:
          this.playerPos[0] += 1;
          moveVector = [1, 0];
          moveRequested = true;
          break;
      }

      if (moveRequested) {
        this.displayTileMapLayer.update(this.map, this.playerPos);
        this.updateObjects(moveVector);
        this.objectContainer && this.objectContainer.children.sort((a: PIXI.DisplayObject, b: PIXI.DisplayObject) => {
            return a.position.y < b.position.y ? 1 : -1;
        });
      }
    }
  }

  private updateObjects(moveVector: [number, number]) {
    this.objectContainer.position.x -= 32 * moveVector[0];
    this.objectContainer.position.y -= 32 * moveVector[1];

    this.playerObject.position.x += 32 * moveVector[0];
    this.playerObject.position.y += 32 * moveVector[1];
  }

  public destroy() {
    this.app.destroy();
    PIXI.loader.reset();
  }

  private initMap(tilesetResource) {
    const map: Array<Array<number>> = [];
    for (let x = 0; x < 1000; x++) {
      map[x] = [];
      for (let y = 0; y < 1000; y++) {
        map[x][y] = randomInt(0, 4);
      }
    }
    this.map = map;

    const tileSize = 16;
    const scale = 2;
    const buffer = 3;
    let horizontalTiles = Math.ceil((this.app.renderer.width / (tileSize * scale))) + buffer;
    let verticalTiles = Math.ceil((this.app.renderer.height / (tileSize * scale))) + buffer;
    if (horizontalTiles % 2 == 0) horizontalTiles++;
    if (verticalTiles % 2 == 0) verticalTiles++;

    this.displayTileMapLayer =
      new DisplayTileMapLayer(tilesetResource.textures, [horizontalTiles, verticalTiles], tileSize, 2);
    this.displayTileMapLayer.update(this.map, this.playerPos);

    this.app.stage.addChild(this.displayTileMapLayer.container);
  }
  
  private initPlayer(playerResource): PIXI.DisplayObject {
    const playerSprite = new PIXI.Sprite(playerResource.texture);
    playerSprite.setTransform(16 * 32, 11 * 32, 2, 2);

    return playerSprite;
  }

  private peszko() {
    PIXI.loader.add("peszko", "../assets/peszko.jpg").load((loader: any, resources: any) => {
      const peszko = new PIXI.Sprite(resources.peszko.texture);

      peszko.x = this.app.renderer.width / 2;
      peszko.y = this.app.renderer.height / 2;

      peszko.anchor.x = 0.5;
      peszko.anchor.y = 0.5;

      this.app.stage.addChild(peszko);

      this.app.ticker.add(() => {
        peszko.rotation += 0.01;
      });
    });
  }

}
