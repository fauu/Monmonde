import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

const render = () => {
  const Game = require("./Game").Game;
  
  ReactDOM.render(
    <AppContainer>
      <Game />
    </AppContainer>, 
    document.getElementById("game-container")
  );
}

render();
if (module.hot) {
  module.hot.accept(render);
}