import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classNames from "classnames";
import { inject, observer } from "mobx-react";
import { TravelApp } from "./TravelApp";
import { Icon } from "./Icon";
import { GameStore } from "./GameStore";
import { MonGearApp, MonGearStore } from "./MonGearStore";
import Transition from "react-motion-ui-pack";
import { spring } from "react-motion";

interface IMonGearProps {
  gameStore?: GameStore;
  monGearStore?: MonGearStore;
}

@inject("gameStore", "monGearStore")
@observer
export class MonGear extends React.Component<IMonGearProps, {}> {

  private gameStore: GameStore;
  private monGearStore: MonGearStore;

  public componentWillMount() {
    if (this.props.gameStore) {
      this.gameStore = this.props.gameStore;
    } else {
      throw Error("MonGear: Did not receive GameStore");
    }

    if (this.props.monGearStore) {
      this.monGearStore = this.props.monGearStore;
    } else {
      throw Error("MonGear: Did not receive MonGearStore");
    }
  }

  public render() {
    const travelAppButtonClassName = classNames({
      "mongear__app-bar-button": true,
      "mongear__app-bar-button--app-travel": true,
      "mongear__app-bar-button--app-travel--active": this.monGearStore.activeApp == "travel",
    });

    let app;
    switch (this.monGearStore.activeApp) {
      case "travel":
        app = <TravelApp key="1"/>;
        break;
      default:
        app = null;
    }

    return (
      <div className="mongear">
        <div className="mongear__screen">
          <div className="mongear__app-container mongear__app-container--app--travel">
            <Transition
              component={false}
              enter={{
                opacity: spring(1, { stiffness: 400, damping: 80 }),
              }}
              leave={{
                opacity: 0,
              }}
            >
              {this.monGearStore.activeApp == "travel" && <div className="mongear__app-animator" key="1"><TravelApp /></div>}
            </Transition>
          </div>
          <div className="mongear__app-bar">
            <div className="mongear__app-bar-buttons">
              <div 
                className={travelAppButtonClassName}
                onClick={() => this.handleAppButtonClick("travel")}>
                <Icon name="earth" />
              </div>
            </div>
            <div className="mongear__app-bar-button mongear__app-bar-button--exit-mongear" onClick={this.handleExitButtonClick}>
              <Icon name="exit-to-app" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleExitButtonClick = () => {
    this.gameStore.monGearActive = false;
  }

  private handleAppButtonClick = (appName: MonGearApp) => {
    if (this.monGearStore.activeApp == appName) {
      this.monGearStore.activeApp = undefined;
    } else {
      this.monGearStore.activeApp = appName;
    }
  }

}
