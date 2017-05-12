import * as React from "react";
import * as ReactDOM from "react-dom";
import { inject, observer } from "mobx-react";
import { GameStore } from "./GameStore";
import { Icon } from "./Icon";

interface ISidebarProps {
  gameStore?: GameStore;
}

@inject("gameStore")
@observer
export class Sidebar extends React.Component<ISidebarProps, {}> {

  private gameStore: GameStore;

  public componentWillMount() {
    if (this.props.gameStore) {
      this.gameStore = this.props.gameStore;
    }
  }

  public render() {
    return (
      <div className="sidebar">
        {this.gameStore.state == "InExploration" && <WorldMapButton onClick={this.handleWorldMapButtonClick} />}
        {this.gameStore.state == "InWorldMap" && <BackToExplorationButton onClick={this.handleBackToExplorationButtonClick} />}
      </div>
    )
  }

  private handleWorldMapButtonClick = () => {
    this.gameStore.state = "InWorldMap";
  };

  private handleBackToExplorationButtonClick = () => {
    this.gameStore.state = "InExploration";
  };

}

const WorldMapButton = (props: { onClick: any }) => (
  <div className="sidebar-button" onClick={props.onClick}>
    <Icon name="earth" className="sidebar-button--icon" />
    <span className="sidebar-button--text">World Map</span>
    <Icon name="arrow-right" className="sidebar-button--arrow" />
  </div>
);

const BackToExplorationButton = (props: { onClick: any }) => (
  <div className="sidebar-button" onClick={props.onClick}>
    <Icon name="pine-tree" className="sidebar-button--icon" />
    <span className="sidebar-button--text">Back to exploration</span>
    <Icon name="arrow-right" className="sidebar-button--arrow" />
  </div>
);
