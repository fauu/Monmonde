import * as React from "react";
import * as ReactDOM from "react-dom";
import { inject, observer } from "mobx-react";
import { GameStore } from "./GameStore";

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
  <div className="ui-button" onClick={props.onClick}>
    World Map
  </div>
);

const BackToExplorationButton = (props: { onClick: any }) => (
  <div className="ui-button" onClick={props.onClick}>
    Back to exploration
  </div>
);
