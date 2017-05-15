import { Gaben } from "monmonde-gaben";
import * as React from "react";
import * as ReactDOM from "react-dom";

export class GabenView extends React.Component<{}, {}> {

  public refs: {
    gabenHost: HTMLElement;
  };

  private gaben: Gaben;

  public constructor() {
    super();

    this.gaben = new Gaben();
  }

  public componentDidMount() {
    this.gaben.init(this.refs.gabenHost);
  }

  public render() {
    return (
      <div id="gaben-view" ref="gabenHost" />
    );
  }

  public componentWillUnmount() {
    this.gaben.destroy();
  }

}
