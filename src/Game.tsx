import * as React from "react";
import * as ReactDOM from "react-dom";
import { MonGear } from "./MonGear";
import { ExplorationView } from "./ExplorationView";
import { Sidebar } from "./Sidebar";
import { GameStore } from "./GameStore";
import { MonGearStore } from "./MonGearStore";
import { observer, Provider } from "mobx-react";
import Transition from "react-motion-ui-pack";
import { spring } from "react-motion";

@observer
export class Game extends React.Component<{}, {}> {

  private gameStore: GameStore;
  private monGearStore: MonGearStore;
  private stores = {};

  public constructor() {
    super(); 

    const gameStore = new GameStore();
    this.gameStore = gameStore;

    const monGearStore = new MonGearStore();
    this.monGearStore = monGearStore;

    this.stores = { gameStore, monGearStore };
  }

  public render() {
    return (
      <Provider {...this.stores}>
        <div id="game">
          <ExplorationView />
          <Transition
            component={false}
            enter={{
              translateY: spring(0, { stiffness: 400, damping: 80 })
            }}
            leave={{
              translateY: 2000,
            }}
          >
            {this.gameStore.monGearActive && <div className="mongear-animator" key="1"><MonGear /></div>}
          </Transition>
          <Sidebar />
        </div>
      </Provider>
    );
  }

}