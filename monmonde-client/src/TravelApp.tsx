import { autorun } from "mobx";
import { inject } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GeographyStore } from "./GeographyStore";
import { WorldMap } from "./world-map/WorldMap";

export interface ITravelAppProps {
  geographyStore?: GeographyStore;
}

@inject("geographyStore")
export class TravelApp extends React.Component<ITravelAppProps, {}> {

  public refs: {
    worldMapHost: HTMLElement;
  };

  private geographyStore: GeographyStore;

  private worldMap: WorldMap;

  public componentDidMount() {
    this.geographyStore = this.props.geographyStore!;

    this.worldMap = new WorldMap();
    this.worldMap.init(this.refs.worldMapHost);

    autorun(() => {
      const locations = this.geographyStore.locations;
      if (locations) {
        this.worldMap.addLocationMarkers(locations);
      }
    });
  }

  public render() {
    return (
      <div className="app travel-app">
        <div id="world-map" ref="worldMapHost" />
      </div>
    );
  }

}
