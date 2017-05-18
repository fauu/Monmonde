import * as classNames from "classnames";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as WebView from "react-electron-web-view";

import { Icon } from "../../common/Icon";

@observer
export class WebBrowserApp extends React.Component<{}, void> {

  @observable private addressBarUrl: string = "";
  @observable private faviconUrl: string = "";
  @observable private canGoBack: boolean = false;
  @observable private canGoForward: boolean = false;
  @observable private webpageThemeColor: string;
  private webViewRef: any;

  public render() {
    const webViewWrapperStyle = {
      height: "100%",
      width: "100%",
    };

    const backButtonClassNames = classNames({
      "top-bar-button": true,
      "top-bar-button--back": true,
      "top-bar-button--disabled": !this.canGoBack,
    });
    const forwardButtonClassNames = classNames({
      "top-bar-button": true,
      "top-bar-button--back": true,
      "top-bar-button--disabled": !this.canGoForward,
    });
    const refreshButtonClassNames = classNames({
      "top-bar-button": true,
      "top-bar-button--refresh": true,
    });

    return (
      <div className="app app--web-browser">
        <div className="top-bar">
          <div className={backButtonClassNames} onClick={this.handleBackButtonClick}>
            <Icon name="arrow-left" />
          </div>
          <div className={forwardButtonClassNames} onClick={this.handleForwardButtonClick}>
            <Icon name="arrow-right" />
          </div>
          <div className={refreshButtonClassNames} onClick={this.handleRefreshButtonClick}>
            <Icon name="refresh" />
          </div>

          <form onSubmit={this.handleAddressBarSubmit}>
            <div className="address-bar">
              <img src={this.faviconUrl} className="address-bar__favicon" />
              <input
                type="text"
                value={this.addressBarUrl}
                onChange={this.handleAddressBarUrlChange}
              />
            </div>
          </form>
        </div>

        <WebView
          className="web-view-host"
          ref={this.setWebViewRef}
          src="https://github.com/fauu/Monmonde"
          style={webViewWrapperStyle}
          onDidNavigate={this.handleWebviewDidNavigate}
          onPageFaviconUpdated={this.handleWebviewFaviconUpdated}
        />
      </div>
    );
  }

  private handleAddressBarSubmit = (e) => {
    e.preventDefault();
    this.navigateToUrl(this.addressBarUrl);
  }

  private handleAddressBarUrlChange = (e) => {
    this.faviconUrl = "";
    this.addressBarUrl = e.target.value;
  }

  private handleWebviewDidNavigate = (e) => {
    this.addressBarUrl = e.url;
    this.canGoBack = this.webViewRef.canGoBack();
    this.canGoForward = this.webViewRef.canGoForward();
  }

  private handleWebviewFaviconUpdated = (e) => {
    this.faviconUrl = e.favicons[0];
  }

  private handleBackButtonClick = () => {
    this.webViewRef.goBack();
  }

  private handleForwardButtonClick = () => {
    this.webViewRef.goForward();
  }

  private handleRefreshButtonClick = () => {
    this.webViewRef.reload();
  }

  private setWebViewRef = (element: any) => {
    this.webViewRef = element;
  }

  private navigateToUrl(url: string) {
    if (url.trim().indexOf("http") !== 0) {
      url = "http://" + url;
    }

    this.faviconUrl = "";
    this.addressBarUrl = url;
    this.webViewRef.loadURL(url);
  }

}
