/* eslint-disable @typescript-eslint/no-non-null-assertion */
import chroma from "chroma-js";
import {
  Container,
  Texture,
  Sprite,
  Point,
  TextStyle,
  Spritesheet,
  Text,
  BLEND_MODES,
} from "pixi.js";

import { BattleMon } from "~/battle/engine";

const BAR_MAX_WIDTH = 200;
const HP_BAR_HEIGHT = 15;
const ACTION_BAR_HEIGHT = 15;
const CAST_BAR_HEIGHT = 30;
const HP_COLOR_SCALE = chroma
  .scale(["d60909", "e8b123", "43c04f"])
  .domain([0.05, 0.3, 0.95])
  .mode("lab");
const ENERGY_COLOR_SCALE = chroma.scale(["953bf5", "3bc9f5"]).domain([0.15, 0.65]).mode("lab");
const MON_NAME_STYLE = new TextStyle({
  fontFamily: "Roboto",
  fontWeight: "bold",
  fontSize: 17,
  fill: 0xffffff,
  stroke: 0x000000,
  strokeThickness: 3,
  dropShadow: true,
  dropShadowColor: 0x000000,
  dropShadowBlur: 0,
  dropShadowDistance: 1,
});
const ACTION_NAME_STYLE = new TextStyle({
  fontFamily: "Roboto",
  fontWeight: "bold",
  fontSize: 15,
  fill: 0xffffff,
  dropShadow: true,
  dropShadowColor: 0x000000,
  dropShadowBlur: 2,
  dropShadowDistance: 0,
});

export class MonPlate extends Container {
  constructor(uiSheet: Spritesheet, mon: BattleMon) {
    super();
    this.init(uiSheet, mon);
  }

  private init(uiSheet: Spritesheet, mon: BattleMon) {
    const bg = new Sprite(uiSheet.textures!["mon-plate-bg.png"]);
    bg.name = "bg";
    this.addChild(bg);

    const hpBar = new Sprite(Texture.WHITE);
    hpBar.name = "hpBar";
    this.addChild(hpBar);

    const energyBar = new Sprite(Texture.WHITE);
    energyBar.name = "energyBar";
    this.addChild(energyBar);

    const castBar = new Sprite(Texture.WHITE);
    castBar.name = "castBar";
    this.addChild(castBar);

    const monName = new Text(mon.label, MON_NAME_STYLE);
    monName.name = "monName";
    this.addChild(monName);

    const actionName = new Text("", ACTION_NAME_STYLE);
    actionName.name = "actionName";
    this.addChild(actionName);
    const actionNameCopy = new Text("", ACTION_NAME_STYLE);
    actionNameCopy.name = "actionNameCopy";
    this.addChild(actionNameCopy);

    const offset = new Point(0, monName.height);

    bg.setTransform(0, offset.y, 206, 1);
    bg.blendMode = BLEND_MODES.OVERLAY;

    offset.y += 3;
    offset.x = 3;

    hpBar.setTransform(offset.x, offset.y);
    hpBar.width = BAR_MAX_WIDTH;
    hpBar.height = HP_BAR_HEIGHT;
    hpBar.tint = HP_COLOR_SCALE(1).num();
    this.hpBarFill = mon.hpPercent;

    offset.y += 15 + 3;

    energyBar.setTransform(offset.x, offset.y);
    energyBar.width = BAR_MAX_WIDTH;
    energyBar.height = ACTION_BAR_HEIGHT;
    energyBar.tint = ENERGY_COLOR_SCALE(1).num();
    // TODO: Remove hardcoded max energy
    this.energyBarFill = mon.energy / 100;

    offset.y += 15 + 3;

    castBar.setTransform(offset.x, offset.y);
    castBar.width = 0;
    castBar.height = CAST_BAR_HEIGHT;
    castBar.tint = 0xbaa865;

    offset.y += 15;

    actionName.anchor.set(0.5);
    actionName.x = offset.x + BAR_MAX_WIDTH / 2;
    actionName.y = offset.y;
    actionName.alpha = 0;
    actionNameCopy.anchor = actionName.anchor;
    actionNameCopy.x = actionName.x;
    actionNameCopy.y = actionName.y;
    actionNameCopy.alpha = 0;
  }

  get hpBarFill(): number {
    const hpBar = this.getChild<Sprite>("hpBar")!;
    return hpBar.width / BAR_MAX_WIDTH;
  }

  set hpBarFill(fill: number) {
    const hpBar = this.getChild<Sprite>("hpBar")!;
    hpBar.tint = HP_COLOR_SCALE(fill).num();
    hpBar.width = fill * BAR_MAX_WIDTH;
  }

  get castBarFill(): number {
    const castBar = this.getChild<Sprite>("castBar")!;
    return castBar.width / BAR_MAX_WIDTH;
  }

  set castBarFill(fill: number) {
    const castBar = this.getChild<Sprite>("castBar")!;
    castBar.width = fill * BAR_MAX_WIDTH;
  }

  get energyBarFill(): number {
    const energyBar = this.getChild<Sprite>("energyBar")!;
    return energyBar.width / BAR_MAX_WIDTH;
  }

  set energyBarFill(fill: number) {
    const energyBar = this.getChild<Sprite>("energyBar")!;
    energyBar.tint = ENERGY_COLOR_SCALE(fill).num();
    energyBar.width = fill * BAR_MAX_WIDTH;
  }

  set actionName(name: string) {
    const actionName = this.getChild<Text>("actionName")!;
    actionName.text = name;
  }
}
