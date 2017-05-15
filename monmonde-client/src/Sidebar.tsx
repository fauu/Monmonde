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
        <OpenMonGearButton onClick={this.handleOpenMonGearButtonClick} />
      </div>
    );
  }

  private handleOpenMonGearButtonClick = () => {
    this.gameStore.monGearActive = true;
  }
}

// tslint:disable-next-line:variable-name
const OpenMonGearButton = (props: { onClick: any }) => (
  <div className="sidebar-button sidebar-button--open-mongear" onClick={props.onClick}>
    <Icon name="tablet" className="sidebar-button__icon" />
    <span className="sidebar-button__text">Show MonGear</span>
    <Icon name="arrow-up" className="sidebar-button__arrow" />
  </div>
);
