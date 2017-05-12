import * as PIXI from "pixi.js";
import { DisplayTileMapLayer } from "./DisplayTileMapLayer";

declare var ResizeObserver: any;

export class ExplorationMode {

  private app: PIXI.Application;
  private displayTileMapLayer: DisplayTileMapLayer;
  private map: Array<Array<number>>;
  private playerPos: [number, number];

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

    this.playerPos = [50, 50];

    this.initMap();

    hostResizeObserver.observe(host);

    document.onkeydown = (e) => {
      e = e || window.event;

      let moveRequested: boolean = false;
      
      switch (e.keyCode) {
        case 87:
          this.playerPos[1] -= 1;
          moveRequested = true;
          break;
        case 83:
          this.playerPos[1] += 1;
          moveRequested = true;
          break;
        case 65:
          this.playerPos[0] -= 1;
          moveRequested = true;
          break;
        case 68:
          this.playerPos[0] += 1;
          moveRequested = true;
          break;
      }

      if (moveRequested) {
        this.displayTileMapLayer.update(this.map, this.playerPos);
      }
    }
  }

  public destroy() {
    this.app.destroy();
    PIXI.loader.reset();
  }

  private randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private initMap() {
    PIXI.loader.add("tileset", "../assets/tileset.json").load((_: any, resources: any) => {
      const tileset = resources["tileset"].textures;

      const map: Array<Array<number>> = [];
      for (let x = 0; x < 1000; x++) {
        map[x] = [];
        for (let y = 0; y < 1000; y++) {
          map[x][y] = this.randomInt(0, 4);
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
        new DisplayTileMapLayer(tileset, [horizontalTiles, verticalTiles], tileSize, 2);
      this.displayTileMapLayer.update(this.map, this.playerPos);

      this.app.stage.addChild(this.displayTileMapLayer.container);
    });
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
