import { inject } from "mobx-react";
import * as React from "react";
import { spring } from "react-motion";
import Transition from "react-motion-ui-pack";

import { SettingsStore } from "../core/SettingsStore";

export interface IUiTransitionProps {
  readonly wrapperClassName?: string;
  readonly childWrapperClassName?: string;
  readonly enter?: {};
  readonly leave?: {};
  readonly children?: any;
  readonly settingsStore?: SettingsStore;
}

@inject("settingsStore")
export class UiTransition extends React.Component<IUiTransitionProps, void> {

  public render() {
    const {settingsStore, wrapperClassName, childWrapperClassName, enter, leave, children} = this.props;

    if (settingsStore!.uiTransitionsEnabled) {
      const transitionProps: any = {
        className: wrapperClassName,
        component: wrapperClassName ? "div" : false,
        enter: enter || { opacity: spring(1) },
        leave: leave || { opacity: 0 },
      };

      return (
        <Transition {...transitionProps}>
          {React.Children.map(children, (c, i) => this.renderChild(c, i, childWrapperClassName))}
        </Transition>
      );
    } else {
      return (
        children &&
        this.renderChild(
          (Array.isArray(children) ? children.find((c) => c !== false) : children),
          1,
          childWrapperClassName,
        )
      ) || null;
    }
  }

  private renderChild(child, key: number, wrapperClassName?: string) {
    if (child && wrapperClassName) {
      return (
        <div key={key} className={wrapperClassName}>
          {child}
        </div>
      );
    } else {
      return child;
    }
  }

}
