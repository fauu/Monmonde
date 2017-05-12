import { observable } from "mobx";

type GameState = "InWorldMap" | "InExploration";

export class GameStore {

  @observable public state: GameState = "InExploration";

}