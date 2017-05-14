import * as React from "react";
import * as ReactDOM from "react-dom";
import { Gaben } from "monmonde-gaben";

export class ExplorationView extends React.Component<{}, {}> {

  public refs: {
    gabenHost: HTMLElement; 
  }
  
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
      <div id="exploration-view" ref="gabenHost" />
    );
  }

  public componentWillUnmount() {
    this.gaben.destroy();
  }

}