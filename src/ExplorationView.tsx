import * as React from "react";
import * as ReactDOM from "react-dom";
import { ExplorationMode } from "./exploration-mode/ExplorationMode";

export class ExplorationView extends React.Component<{}, {}> {

  public refs: {
    explorationModeHost: HTMLElement; 
  }
  
  private explorationMode: ExplorationMode;

  public constructor() {
    super();

    this.explorationMode = new ExplorationMode();
  }

  public componentDidMount() {
    this.explorationMode.init(this.refs.explorationModeHost);
  }

  public render() {
    return (
      <div id="exploration-view" ref="explorationModeHost" />
    );
  }

  public componentWillUnmount() {
    this.explorationMode.destroy();
  }

}