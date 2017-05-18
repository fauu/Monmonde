import * as classNames from "classnames";
import { inject, observer } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { spring } from "react-motion";
import Transition from "react-motion-ui-pack";
import { Icon } from "../common/Icon";
import { GameStore } from "../core/GameStore";
import { MonGearApp, MonGearStore } from "./MonGearStore";
import { TravelApp } from "./travel/TravelApp";
import { WebBrowserApp } from "./web-browser/WebBrowserApp";

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
    this.gameStore = this.props.gameStore!;
    this.monGearStore = this.props.monGearStore!;
  }

  public render() {
    const travelAppButtonClassName = classNames({
      "mongear__app-bar-button": true,
      "mongear__app-bar-button--active": this.monGearStore.activeApp === "travel",
      "mongear__app-bar-button--travel": true,
    });
    const webBrowserAppButtonClassName = classNames({
      "mongear__app-bar-button": true,
      "mongear__app-bar-button--active": this.monGearStore.activeApp === "web-browser",
      "mongear__app-bar-button--web-browser": true,
    });

    return (
      <div className="mongear">
        <div className="mongear__screen">
          <div className="mongear__app-container mongear__app-container--app--travel">
            <Transition
              component="div"
              enter={{ opacity: 1 }}
              leave={{ opacity: 0 }}
            >
              {this.monGearStore.activeApp === "travel" && <div className="mongear__app-animator" key="1"><TravelApp /></div>}
              {this.monGearStore.activeApp === "web-browser" && <div className="mongear__app-animator" key="2"><WebBrowserApp /></div>}
            </Transition>
          </div>

          <div className="mongear__app-bar">
            <div className="mongear__app-bar-buttons">
              <div
                className={travelAppButtonClassName}
                onClick={() => this.handleAppButtonClick("travel")}>
                <Icon name="earth" />
              </div>
              <div
                className={webBrowserAppButtonClassName}
                onClick={() => this.handleAppButtonClick("web-browser")}>
                <Icon name="web" />
              </div>
            </div>
            <div className="mongear__app-bar-button mongear__app-bar-button--exit-mongear" onClick={this.handleExitButtonClick}>
              <Icon name="arrow-down" />
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
    if (this.monGearStore.activeApp === appName) {
      this.monGearStore.activeApp = undefined;
    } else {
      this.monGearStore.activeApp = appName;
    }
  }

}
