const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const bundleFilename = "main.bundle.js";
const outDirName = "out";
const outPath = path.resolve(__dirname, outDirName);
const srcDirName = "src";
const resDir = "res";
const htmlTemplatePath = path.join(srcDirName, "index.html");
const entry = path.resolve(__dirname, srcDirName);

const config = {
  context: __dirname,
  output: {
    filename: bundleFilename,
    path: outPath,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|woff2)$/,
        loader: "url-loader",
        options: {
          limit: 100000,
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    symlinks: false, // ?
    plugins: [new TsconfigPathsPlugin({})],
  },
  plugins: [
    new webpack.ProvidePlugin({
      PIXI: "pixi.js",
    }),
    new CopyWebpackPlugin({ patterns: [{ from: resDir }] }),
    // new ForkTsCheckerWebpackPlugin({
    //   //vue: true, // https://github.com/Realytics/fork-ts-checker-webpack-plugin/issues/254
    //   eslint: true,
    // }),
    new HtmlWebpackPlugin({
      template: htmlTemplatePath,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

module.exports = {
  config,
  outDirName,
  entry,
};
