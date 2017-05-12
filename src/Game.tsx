import * as React from "react";
import * as ReactDOM from "react-dom";
import { WorldMapView } from "./WorldMapView";
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
      case "InWorldMap":
        view = <WorldMapView />;
        break;
    }

    return (
      <div id="game">
        {view}
        <Provider {...this.stores}>
          <Sidebar />
        </Provider>
      </div>
    );
  }

}