import { inject, observer } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Icon } from "../common/Icon";
import { GameStore } from "../core/GameStore";

interface ISidebarProps {
  readonly gameStore?: GameStore;
}

@inject("gameStore")
@observer
export class Sidebar extends React.Component<ISidebarProps, void> {

  private gameStore: GameStore;

  public componentWillMount() {
    if (this.props.gameStore) {
      this.gameStore = this.props.gameStore;
    } else {
      throw Error("Sidebar: Did not receive GameStore");
    }
  }

  public render() {
    const exitExplorationZoneButton =
      <ExitExplorationZoneButton onClick={this.handleExitExplorationZoneButtonClick} />;

    return (
      <div className="sidebar">
        <div className="sidebar__group sidebar__group--top">
          {this.gameStore.activeView === "GabenView" && exitExplorationZoneButton}
        </div>
        <div className="sidebar__group sidebar__group--bottom">
          <OpenMonGearButton onClick={this.handleOpenMonGearButtonClick} />
        </div>
      </div>
    );
  }
  private handleExitExplorationZoneButtonClick = () => {
    this.gameStore.activeView = "LocationView";
  }

  private handleOpenMonGearButtonClick = () => {
    this.gameStore.monGearActive = true;
  }
}

const ExitExplorationZoneButton = (props: { onClick: any }) => (
  <div className="sidebar-button sidebar-button--exit-exploration-zone" onClick={props.onClick}>
    <Icon name="exit-to-app" className="sidebar-button__icon" />
    <span className="sidebar-button__text">Exit Zone</span>
  </div>
);

const OpenMonGearButton = (props: { onClick: any }) => (
  <div className="sidebar-button sidebar-button--open-mongear" onClick={props.onClick}>
    <Icon name="tablet" className="sidebar-button__icon" />
    <span className="sidebar-button__text">Show MonGear</span>
    <Icon name="arrow-up" className="sidebar-button__arrow" />
  </div>
);
