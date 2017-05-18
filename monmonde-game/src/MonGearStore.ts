import { observable } from "mobx";

export type MonGearApp = "travel" | "web-browser"| undefined;

export class MonGearStore {

  @observable public activeApp: MonGearApp = "travel";

}
