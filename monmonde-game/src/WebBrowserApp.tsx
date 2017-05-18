import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as WebView from "react-electron-web-view";

@observer
export class WebBrowserApp extends React.Component<{}, {}> {

  @observable private webviewUrl: string = "http://github.com/fauu/Monmonde";
  @observable private addressBarUrl: string = "";
  @observable private faviconUrl: string = "";

  public render() {
    const webViewWrapperStyle = {
      height: "100%",
      width: "100%",
    };

    return (
      <div className="app app--web-browser">
        <div className="top-bar">
          <form onSubmit={this.handleAddressBarSubmit}>
            <div className="address-bar">
              <img src={this.faviconUrl} className="address-bar__favicon" />
              <input
                type="text"
                className="address-bar__input"
                value={this.addressBarUrl}
                onChange={this.handleAddressBarUrlChange}
              />
            </div>
          </form>
        </div>
        <WebView
          src={this.webviewUrl}
          style={webViewWrapperStyle}
          onDidNavigate={this.handleWebviewDidNavigate}
          onPageFaviconUpdated={this.handleWebviewFaviconUpdated}
        />
      </div>
    );
  }

  private handleAddressBarSubmit = (e) => {
    e.preventDefault();

    let url = this.addressBarUrl;
    if (url.trim().indexOf("http") !== 0) {
      url = "http://" + url;
    }

    this.faviconUrl = "";
    this.addressBarUrl = url;
    this.webviewUrl = url;
  }

  private handleAddressBarUrlChange = (e) => {
    this.faviconUrl = "";
    this.addressBarUrl = e.target.value;
  }

  private handleWebviewDidNavigate = (e) => {
    this.addressBarUrl = e.url;
  }

  private handleWebviewFaviconUpdated = (e) => {
    this.faviconUrl = e.favicons[0];
  }

}
