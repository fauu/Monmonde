import * as classNames from "classnames";
import { observable, when } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Icon } from "../../common/Icon";
import { GameStore } from "../../core/GameStore";
import { GeographyStore } from "../../core/GeographyStore";

import { WorldMap } from "./WorldMap";

export interface ITravelAppProps {
  readonly gameStore?: GameStore;
  readonly geographyStore?: GeographyStore;
}

type ZoomButton = "Plus" | "Minus";

@inject("gameStore", "geographyStore")
@observer
export class TravelApp extends React.Component<ITravelAppProps, void> {

  private gameStore: GameStore;
  private geographyStore: GeographyStore;

  private worldMapHostRef: HTMLElement;
  private worldMap: WorldMap;

  @observable private zoomPlusEnabled: boolean;
  @observable private zoomMinusEnabled: boolean;

  public componentDidMount() {
    this.geographyStore = this.props.geographyStore!;
    this.gameStore = this.props.gameStore!;

    when(
      () => this.geographyStore.locations !== undefined && this.gameStore.player !== undefined,
      () => {
        this.worldMap = new WorldMap(this.handleMapZoomEnd);

        const playerLocation = this.gameStore.player.location;

        const viewCenterCoords: [number, number] = [playerLocation.latitude, playerLocation.longitude];
        this.worldMap.init(this.worldMapHostRef, viewCenterCoords);

        const locations = this.geographyStore.locations!;
        this.worldMap.addLocationMarkers(locations, playerLocation);
      },
    );
  }

  public render() {
    return (
      <div className="app travel-app">

        <div className="world-map__zoom-control">
          <div className={this.getZoomButtonClassName("Plus")} onClick={this.handleZoomPlusClick}>
            <Icon name="plus" />
          </div>
          <div className={this.getZoomButtonClassName("Minus")} onClick={this.handleZoomMinusClick}>
            <Icon name="minus" />
          </div>
        </div>

        <div id="world-map" ref={this.setWorldMapHostRef} />

      </div>
    );
  }

  private getZoomButtonClassName(button: ZoomButton): string {
    return classNames({
      "world-map__zoom-button": true,
      "world-map__zoom-button--disabled":
        (button === "Plus" && !this.zoomPlusEnabled) || (button === "Minus" && !this.zoomMinusEnabled),
      [`world-map__zoom-button--${button.toLowerCase()}`]: true,
    });
  }

  private handleMapZoomEnd = () => {
    this.zoomPlusEnabled = !this.worldMap.isMaxZoomed();
    this.zoomMinusEnabled = !this.worldMap.isMinZoomed();
  }

  private handleZoomPlusClick = () => {
    this.worldMap.zoomIn();
  }

  private handleZoomMinusClick = () => {
    this.worldMap.zoomOut();
  }

  private setWorldMapHostRef = (element: HTMLElement) => {
    this.worldMapHostRef = element;
  }

}
