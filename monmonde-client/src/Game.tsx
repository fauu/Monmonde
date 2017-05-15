import { observer, Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { spring } from "react-motion";
import Transition from "react-motion-ui-pack";
import { GabenView } from "./GabenView";
import { GameStore } from "./GameStore";
import { MonGear } from "./MonGear";
import { MonGearStore } from "./MonGearStore";
import { Sidebar } from "./Sidebar";

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
          <GabenView />
          <Transition
            component={false}
            enter={{ opacity: spring(1) }}
            leave={{ opacity: 0 }}
          >
            {this.gameStore.monGearActive && <div className="screen-fade" key="1" />}
          </Transition>
          <Transition
            component={false}
            enter={{ translateY: spring(0, { stiffness: 400, damping: 80 }) }}
            leave={{ translateY: 2000 }}
          >
            {this.gameStore.monGearActive && <div className="mongear-animator" key="1"><MonGear /></div>}
          </Transition>
          <Sidebar />
        </div>
      </Provider>
    );
  }

}
