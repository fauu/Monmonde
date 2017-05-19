import * as classNames from "classnames";
import * as React from "react";

interface IIconProps {
  readonly name: string;
  readonly rotation?: number;
  readonly className?: string;
}

export class Icon extends React.Component<IIconProps, any> {

  public render() {
    const className = classNames({
      mdi: true,
      [`mdi-${this.props.name}`]: true,
      [`mdi-rotate-${this.props.rotation}`]: this.props.rotation,
      [`${this.props.className}`]: this.props.className,
    });

    return <i className={className} />;
  }

}
