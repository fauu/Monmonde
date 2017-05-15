import * as React from "react";
import * as ReactDOM from "react-dom";
import * as WebView from "react-electron-web-view";

export class WebBrowserApp extends React.Component<{}, {}> {

  public render() {
    const webViewWrapperStyle = {
      height: "100%",
      width: "100%",
    };

    return (
      <div className="app app--web-browser">
        <div className="top-bar">
          <input type="text" className="address-bar" value="http://4chan.org/g/" />
        </div>
        <WebView src="http://4chan.org/g/" style={webViewWrapperStyle} />
      </div>
    );
  }

}
