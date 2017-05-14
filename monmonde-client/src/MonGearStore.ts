import { observable } from "mobx";

export type MonGearApp = "travel" | undefined;

export class MonGearStore {

  @observable public activeApp: MonGearApp = "travel";

}
