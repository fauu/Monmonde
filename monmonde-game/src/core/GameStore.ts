import { observable } from "mobx";

import { Player } from "./Player";

type GameView = "GabenView" | "LocationView";

export class GameStore {

  @observable public activeView: GameView | undefined;
  @observable public monGearActive: boolean = false;
  @observable public player: Player;

}
