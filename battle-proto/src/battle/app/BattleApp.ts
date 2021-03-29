/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as PIXI from "pixi.js"; // Currently cannot avoid this with GSAP
import {
  Application,
  Container,
  Text,
  Sprite,
  Loader,
  ILoaderResource,
  settings,
  SCALE_MODES,
} from "pixi.js";

import { MonPlate, MonSprite, ProcedureSchedule } from "~/battle/app";
import { BattleEngine } from "~/battle/engine";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const FPS = 60;
const ENGINE_TICK_FRAMES = FPS / BattleEngine.TICKRATE;
const ENGINE_TICK_MSEC = ENGINE_TICK_FRAMES / FPS;

interface MonUi {
  plate: MonPlate;
  sprite: Sprite;
}

export class BattleApp {
  public static readonly SIZE = [720, 480];

  private engine: BattleEngine;
  private monUi: MonUi[];
  private pixiApp: Application;
  private procedureSchedule: ProcedureSchedule;

  private frameNo = -1;

  constructor(engine: BattleEngine) {
    this.engine = engine;
    this.monUi = [];
    this.pixiApp = new Application();
    this.procedureSchedule = new ProcedureSchedule();
    this.init();
  }

  get element(): HTMLElement {
    return this.pixiApp.view;
  }

  private init() {
    this.pixiApp.renderer.resize(BattleApp.SIZE[0], BattleApp.SIZE[1]);
    settings.SCALE_MODE = SCALE_MODES.NEAREST;
    settings.ROUND_PIXELS = true;

    this.pixiApp.loader
      .add("bg", "bg.png")
      .add("uiSheet", "ui.json")
      .add("charizard-back", "charizard-back.json")
      .add("nidoking", "nidoking.json")
      .load(this.handleResourcesLoad.bind(this));
  }

  private handleResourcesLoad(
    _loader: Loader,
    resources: Partial<Record<string, ILoaderResource>>
  ) {
    this.setupUi(resources);
  }

  private setupUi(resources: Partial<Record<string, ILoaderResource>>) {
    const uiSheet = resources["uiSheet"]!.spritesheet!;

    const bg = new Sprite(resources["bg"]!.texture);
    bg.name = "bg";

    const monPlates = [];

    monPlates.push(new MonPlate(uiSheet, this.engine.battle.playerMon));
    monPlates[0].name = "playerMonPlate";
    monPlates[0].setTransform(7, 5);

    monPlates.push(new MonPlate(uiSheet, this.engine.battle.mons[1]));
    monPlates[1].name = "enemyMonPlate";
    monPlates[1].setTransform(507, 5);

    const monSprites = [];

    monSprites.push(
      new MonSprite(resources["charizard-back"]!.spritesheet!.animations["charizard-back"]!, {
        direction: [0.4, 0.5],
        floorY: 460,
        padding: 200,
      })
    );
    monSprites[0].name = "playerMonSprite";
    monSprites[0].play();
    monSprites[0].setTransform(170, 240, 2, 2);

    monSprites.push(
      new MonSprite(resources["nidoking"]!.spritesheet!.animations["nidoking"]!, {
        direction: [0.6, 0.2],
        floorY: 230,
        padding: 100,
      })
    );
    monSprites[1].name = "enemyMonSprite";
    monSprites[1].play();
    monSprites[1].setTransform(510, 150);

    this.monUi = [
      { sprite: monSprites[0], plate: monPlates[0] },
      { sprite: monSprites[1], plate: monPlates[1] },
    ];

    this.pixiApp.stage.addChild(bg, ...monSprites, ...monPlates);
    this.pixiApp.ticker.add(this.tick.bind(this));

    this.pixiApp.stage.alpha = 0;
    gsap.to(this.pixiApp.stage, { pixi: { alpha: 1 }, duration: 0.5 });
  }

  private tick() {
    this.procedureSchedule.update();

    if (++this.frameNo % ENGINE_TICK_FRAMES != 0) return;

    for (const event of this.engine.handleTick()) {
      switch (event.type) {
        case "ActionCastStarted":
          {
            const plate = this.monUi[event.monIdx].plate;
            plate.actionName = event.actionName;
            gsap.to(plate.getChild<Text>("actionName")!, {
              pixi: { alpha: 1 },
              duration: 0.1,
            });
          }
          break;
        case "ActionCastProgressed":
          gsap.to(this.monUi[event.monIdx].plate, {
            castBarFill: event.newCastTimeElapsedPercent,
            ease: "none",
            duration: ENGINE_TICK_MSEC,
          });
          break;
        case "ActionCastEnded":
          {
            const plate = this.monUi[event.monIdx].plate;
            const actionName = plate.getChild<Text>("actionName")!;
            const actionNameCopy = plate.getChild<Text>("actionNameCopy")!;
            actionName.name = "actionNameCopy";
            actionNameCopy.name = "actionName";
            this.procedureSchedule.schedule(ENGINE_TICK_FRAMES + 1, () => {
              plate.castBarFill = 0;
              gsap
                .to(actionName, {
                  pixi: { scaleX: 3, scaleY: 3, alpha: 0 },
                  ease: "power4",
                  duration: 1,
                })
                .then(() => {
                  actionName.scale.set(1);
                });
            });
          }
          break;
        case "EnergyChanged":
          gsap.to(this.monUi[event.monIdx].plate, {
            energyBarFill: event.newEnergyPercent,
            ease: "none",
            duration: ENGINE_TICK_MSEC,
          });
          break;
        case "DamageTaken":
          {
            const monUi = this.monUi[event.monIdx];
            gsap.to(monUi.sprite, {
              pixi: {
                colorize: "red",
                colorizeAmount: 1,
                positionX: monUi.sprite.position.x + 10,
                positionY: monUi.sprite.position.y - 3,
                scale: 0.97,
              },
              repeat: 1,
              yoyo: true,
              duration: 0.075,
            });
            gsap.to(monUi.sprite, {
              pixi: {
                blurX: 2,
                blurY: 2,
              },
              repeat: 3,
              yoyo: true,
              yoyoEase: true,
              duration: 0.05,
            });
          }
          break;
        case "HpChanged":
          {
            const monUi = this.monUi[event.monIdx];
            gsap.to(monUi.plate, {
              hpBarFill: event.newHpPercent,
              ease: "none",
              duration: ENGINE_TICK_MSEC,
            });
          }
          break;
      }
    }
  }
}

Container.prototype.getChild = function <T extends Container>(name: string): T | undefined {
  if (!this.getChildByName) return undefined;
  const child = this.getChildByName(name) as T | null;
  return child ?? undefined;
};
