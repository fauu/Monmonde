import * as React from "react";
import * as ReactDOM from "react-dom";
import { WorldMap } from "./world-map/WorldMap";

export class TravelApp extends React.Component<{}, {}> {

  private worldMap: WorldMap;

  public refs: {
    worldMapHost: HTMLElement; 
  }

  public componentDidMount() {
    this.worldMap = new WorldMap();
    this.worldMap.init(this.refs.worldMapHost);
  }

  public render() {
    return (
      <div className="app travel-app">
        <div id="world-map" ref="worldMapHost" />
      </div>
    );
  }

}