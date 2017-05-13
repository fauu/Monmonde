import * as React from "react";
import * as ReactDOM from "react-dom";
import { inject } from "mobx-react";
import { TravelApp } from "./TravelApp";
import { Icon } from "./Icon";
import { GameStore } from "./GameStore";

interface IMonGearProps {
  gameStore?: GameStore;
}

@inject("gameStore")
export class MonGear extends React.Component<IMonGearProps, {}> {

  private gameStore: GameStore;

  public componentWillMount() {
    if (this.props.gameStore) {
      this.gameStore = this.props.gameStore;
    } else {
      throw Error("MonGear: Did not receive GameStore");
    }
  }

  public render() {
    return (
      <div className="mongear">
        <div className="mongear__screen">
          <div className="mongear__app-container mongear__app-container--app--travel">
            <div className="mongear__top-bar">
              <div className="mongear__app-title">
                <Icon name="earth" className="mongear__top-bar-icon" />
                <span className="mongear__top-bar-text">Travel</span>
              </div>
              <div className="mongear__exit-button" onClick={this.handleExitButtonClick}>
                <Icon name="close" className="mongear__exit-icon" />
              </div>
            </div>
            <TravelApp />
          </div>
        </div>
      </div>
    );
  }

  private handleExitButtonClick = () => {
    this.gameStore.state = "InExploration";
  }

}
