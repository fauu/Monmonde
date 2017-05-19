import * as classNames from "classnames";
import * as React from "react";

import { Icon } from "../common/Icon";
import { MonGearApp } from "./MonGearStore";

interface IAppBarButtonProps {
  readonly app: MonGearApp;
  readonly iconName: string;
  readonly isActive: boolean;
  readonly onClick: (app: MonGearApp) => any;
}

export class AppBarButton extends React.Component<IAppBarButtonProps, void> {

  public render() {
    const className = classNames({
      "mongear__app-bar-button": true,
      "mongear__app-bar-button--active": this.props.isActive,
      [`mongear__app-bar-button--${this.props.app}`]: true,
    });

    return (
      <div className={className} onClick={this._onClick}>
        <Icon name={this.props.iconName} />
      </div>
    );
  }

  private _onClick = () => {
    this.props.onClick(this.props.app);
  }

}
