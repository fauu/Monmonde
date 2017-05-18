import { observer, Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { spring } from "react-motion";
import Transition from "react-motion-ui-pack";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { MonGear } from "../mon-gear/MonGear";
import { Sidebar } from "../sidebar/Sidebar";

import { GabenView } from "../gaben-view/GabenView";
import { LocationView } from "../location-view/LocationView";

import { MonGearStore } from "../mon-gear/MonGearStore";
import { GameStore } from "./GameStore";
import { GeographyStore } from "./GeographyStore";

import { Country } from "./Country";
import { ExplorationZone } from "./ExplorationZone";
import { Location } from "./Location";
import { Player } from "./Player";
import { Settlement } from "./Settlement";

@observer
export class Game extends React.Component<{}, {}> {

  private gameStore: GameStore;
  private geographyStore: GeographyStore;
  private monGearStore: MonGearStore;
  private stores = {};

  public constructor() {
    super();

    this.gameStore = new GameStore();
    this.monGearStore = new MonGearStore();
    this.geographyStore = new GeographyStore();

    this.stores = {
      gameStore: this.gameStore,
      geographyStore: this.geographyStore,
      monGearStore: this.monGearStore,
    };

    this.initDevDb();
  }

  public render() {
    return (
      <Provider {...this.stores}>
        <div id="game">
          <Transition
            component="div"
            enter={{ opacity: spring(1) }}
            leave={{ opacity: 0 }}
          >
            {this.gameStore.activeView === "GabenView" && <div key="1"><GabenView /></div>}
            {this.gameStore.activeView === "LocationView" && <div key="2"><LocationView /></div>}
          </Transition>

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

  private initDevDb() {
    createConnection({
      autoSchemaSync: true,
      driver: {
        storage: ":memory:",
        type: "sqlite",
      },
      entities: [
        Country,
        ExplorationZone,
        Location,
        Settlement,
      ],
    }).then(async (connection) => {
      await this.geographyStore.init(
        connection.getRepository(Country),
        connection.getRepository(Location),
      );

      this.initGameState();
    }).catch((error) => {
      throw new Error(`Database error: ${error}`);
    });
  }

  private initGameState() {
    const startingLocation = this.geographyStore.locations!.find((l) => l.settlement.name === "Warsaw")!;
    this.gameStore.player = new Player({ location: startingLocation });
    this.gameStore.activeView = "LocationView";
    this.gameStore.monGearActive = true;
  }

}
