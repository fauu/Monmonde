import { observable } from "mobx";

type GameState = "InMonGear" | "InExploration";

export class GameStore {

  @observable public state: GameState = "InMonGear";

}