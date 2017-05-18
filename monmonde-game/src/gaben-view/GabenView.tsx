import * as React from "react";
import * as ReactDOM from "react-dom";

import { Gaben } from "monmonde-gaben";

export class GabenView extends React.Component<{}, void> {

  private gabenHostRef: HTMLElement;
  private gaben: Gaben;

  public constructor() {
    super();

    this.gaben = new Gaben();
  }

  public componentDidMount() {
    this.gaben.init(this.gabenHostRef);
  }

  public render() {
    return (
      <div className="view view--gaben" ref={this.setGabenHostRef} />
    );
  }

  public componentWillUnmount() {
    this.gaben.destroy();
  }

  private setGabenHostRef = (element: HTMLElement) => {
    this.gabenHostRef = element;
  }

}
