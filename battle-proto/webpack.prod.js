const path = require("path");
const webpack = require("webpack");

const { merge } = require("webpack-merge");

const common = require("./webpack.common");

module.exports = merge(common.config, {
  mode: "production",
  entry: ["@babel/polyfill", common.entry],
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // terser here?
  ],
});
