const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { merge } = require("webpack-merge");

const common = require("./webpack.common");

const devServerHost = "localhost";
const devServerPort = 8080;
const devServerUrl = `http://${devServerHost}:${devServerPort}/`;

const config = merge(common.config, {
  mode: "development",
  entry: [`webpack-dev-server/client?${devServerUrl}`, "webpack/hot/dev-server", common.entry],
  output: {
    publicPath: common.devServerUrl,
  },
  optimization: {
    moduleIds: "named",
  },
  plugins: [new ReactRefreshPlugin()],
  devServer: {
    host: devServerHost,
    port: devServerPort,
    static: path.join(__dirname, common.outDirName),
    hot: true,
  },
});

module.exports = config;
