import { randomInt } from "monmonde-utils";
import * as PIXI from "pixi.js";
import { Exploration } from "./Exploration";

declare var ResizeObserver: any;

export class Gaben {

  private gaben: PIXI.Application;

  public constructor() {
    this.gaben = new PIXI.Application();
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  }

  public init(host: HTMLElement) {
    host.appendChild(this.gaben.view);

    const hostResizeObserver = new ResizeObserver((entries: any) => {
      for (const entry of entries) {
        const {width, height} = entry.contentRect;

        if (this.gaben.renderer) {
          this.gaben.renderer.resize(width, height);
        }
      }
    });

    const exploration = new Exploration(PIXI.loader);
    exploration.init();
    this.gaben.stage.addChild(exploration.container);
  }

  public destroy() {
    this.gaben.destroy();
    PIXI.loader.reset();
  }

  private peszko() {
    PIXI.loader.add("peszko", "../assets/peszko.jpg").load((loader: any, resources: any) => {
      const peszko = new PIXI.Sprite(resources.peszko.texture);

      peszko.x = this.gaben.renderer.width / 2;
      peszko.y = this.gaben.renderer.height / 2;

      peszko.anchor.x = 0.5;
      peszko.anchor.y = 0.5;

      this.gaben.stage.addChild(peszko);

      this.gaben.ticker.add(() => {
        peszko.rotation += 0.01;
      });
    });
  }

}
