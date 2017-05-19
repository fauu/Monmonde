import { inject } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { GameStore } from "../core/GameStore";

interface ILocationViewProps {
  readonly gameStore?: GameStore;
}

@inject("gameStore")
export class LocationView extends React.Component<ILocationViewProps, void> {

  private gameStore: GameStore;

  public componentWillMount() {
    this.gameStore = this.props.gameStore!;
  }

  public render() {
    const location = this.gameStore.player.location;
    const backgroundPath = `../assets/location-backgrounds/${location.settlement.name.toLowerCase()}.jpg`;
    const flagPath = `../node_modules/flag-icon-css/flags/4x3/pl.svg`;

    return (
      <div className="view view--location" style={{ backgroundImage: `url('${backgroundPath}')` }}>
        <div className="location-view-panel location-view-panel--settlement">
          <div className="location-view-panel__header">
            <img src={flagPath} />
            {location.settlement.name}, {location.country.name}
          </div>
        </div>
        <div className="location-view-panel location-view-panel--exploration-zone">
          <div className="location-view-panel__header">
            {location.explorationZone.name}
          </div>
          <div className="location-view-panel__enter-zone-button" onClick={this.handleEnterZoneButtonClick}>
            Explore
          </div>
        </div>
      </div>
    );
  }

  private handleEnterZoneButtonClick = () => {
    this.gameStore.activeView = "GabenView";
  }

}
