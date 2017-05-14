import * as classNames from "classnames";
import * as React from "react";

interface IIconProps {
  name: string;
  className?: string;
}

export class Icon extends React.Component<IIconProps, any> {

  public render() {
    const className = classNames("mdi", `mdi-${this.props.name}`, this.props.className);

    return <i className={className} />;
  }

}
