import { observer, Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { spring } from "react-motion";
import Transition from "react-motion-ui-pack";
import "reflect-metadata";
import { createConnection } from "typeorm";

import { MonGearStore } from "../mon-gear/MonGearStore";
import { GameStore } from "./GameStore";
import { GeographyStore } from "./GeographyStore";
import { SettingsStore } from "./SettingsStore";

import { GabenView } from "../gaben-view/GabenView";
import { LocationView } from "../location-view/LocationView";
import { MonGear } from "../mon-gear/MonGear";
import { Sidebar } from "../sidebar/Sidebar";

import { Country } from "./Country";
import { ExplorationZone } from "./ExplorationZone";
import { Location } from "./Location";
import { Player } from "./Player";
import { Settlement } from "./Settlement";

import { UiTransition } from "../common/UiTransition";

@observer
export class Game extends React.Component<{}, void> {

  private gameStore: GameStore;
  private settingsStore: SettingsStore;
  private geographyStore: GeographyStore;
  private monGearStore: MonGearStore;
  private stores = {};

  public constructor() {
    super();

    this.gameStore = new GameStore();
    this.settingsStore = new SettingsStore();
    this.monGearStore = new MonGearStore();
    this.geographyStore = new GeographyStore();

    this.stores = {
      gameStore: this.gameStore,
      geographyStore: this.geographyStore,
      monGearStore: this.monGearStore,
      settingsStore: this.settingsStore,
    };

    this.initDevDb();
  }

  public render() {
    return (
      <Provider {...this.stores}>
        <div id="game">
          <UiTransition wrapperClassName="view-animator">
            {this.gameStore.activeView === "GabenView" && <GabenView />}
            {this.gameStore.activeView === "LocationView" && <LocationView />}
          </UiTransition>

          <Sidebar />

          <UiTransition>
            {this.gameStore.monGearActive && <div className="screen-fade" key="1" />}
          </UiTransition>

          <UiTransition
            childWrapperClassName="mongear-container"
            enter={{ translateY: spring(0, { stiffness: 400, damping: 80 }) }}
            leave={{ translateY: 2000 }}
          >
            {this.gameStore.monGearActive && <MonGear />}
          </UiTransition>
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
