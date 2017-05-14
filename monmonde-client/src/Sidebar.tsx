import { inject, observer } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
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
    } else {
      throw Error("Sidebar: Did not receive GameStore");
    }
  }

  public render() {
    return (
      <div className="sidebar">
        <WorldMapButton onClick={this.handleWorldMapButtonClick} />
      </div>
    );
  }

  private handleWorldMapButtonClick = () => {
    this.gameStore.monGearActive = true;
  }
}

// tslint:disable-next-line:variable-name
const WorldMapButton = (props: { onClick: any }) => (
  <div className="sidebar-button" onClick={props.onClick}>
    <Icon name="earth" className="sidebar-button--icon" />
    <span className="sidebar-button--text">Travel</span>
    <Icon name="arrow-right" className="sidebar-button--arrow" />
  </div>
);

// tslint:disable-next-line:variable-name
const BackToExplorationButton = (props: { onClick: any }) => (
  <div className="sidebar-button" onClick={props.onClick}>
    <Icon name="pine-tree" className="sidebar-button--icon" />
    <span className="sidebar-button--text">Back to exploration</span>
    <Icon name="arrow-right" className="sidebar-button--arrow" />
  </div>
);
