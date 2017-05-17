import { when } from "mobx";
import { inject } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GameStore } from "./GameStore";
import { GeographyStore } from "./GeographyStore";
import { WorldMap } from "./world-map/WorldMap";

export interface ITravelAppProps {
  gameStore?: GameStore;
  geographyStore?: GeographyStore;
}

@inject("gameStore", "geographyStore")
export class TravelApp extends React.Component<ITravelAppProps, {}> {

  public refs: {
    worldMapHost: HTMLElement;
  };

  private gameStore: GameStore;
  private geographyStore: GeographyStore;

  private worldMap: WorldMap;

  public componentDidMount() {
    this.geographyStore = this.props.geographyStore!;
    this.gameStore = this.props.gameStore!;

    when(
      () => this.geographyStore.locations !== undefined && this.gameStore.player !== undefined,
      () => {
        this.worldMap = new WorldMap();

        const playerLocation = this.gameStore.player.location;

        const viewCenterCoords: [number, number] = [playerLocation.latitude, playerLocation.longitude];
        this.worldMap.init(this.refs.worldMapHost, viewCenterCoords);

        const locations = this.geographyStore.locations!;
        this.worldMap.addLocationMarkers(locations, playerLocation);
      },
    );
  }

  public render() {
    return (
      <div className="app travel-app">
        <div id="world-map" ref="worldMapHost" />
      </div>
    );
  }

}
