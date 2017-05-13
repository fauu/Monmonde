import * as React from "react";
import * as ReactDOM from "react-dom";
import { MonGear } from "./MonGear";
import { ExplorationView } from "./ExplorationView";
import { Sidebar } from "./Sidebar";
import { GameStore } from "./GameStore";
import { observer, Provider } from "mobx-react";

@observer
export class Game extends React.Component<{}, {}> {

  private gameStore: GameStore;
  private stores = {};

  public constructor() {
    super(); 

    const gameStore = new GameStore();
    this.gameStore = gameStore;

    this.stores = { gameStore };
  }

  public render() {
    let view;
    switch (this.gameStore.state) {
      case "InExploration":
        view = <ExplorationView />;
        break;
      case "InMonGear":
        view = <MonGear />;
        break;
    }

    return (
      <Provider {...this.stores}>
        <div id="game">
          {view}
          {this.gameStore.state == "InExploration" ? <Sidebar /> : <span />}
        </div>
      </Provider>
    );
  }

}