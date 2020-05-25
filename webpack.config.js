const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const outputDirectory = path.join(__dirname, "package");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  optimization: {
    minimize: false
  },
  performance: {
    hints: false
  },
  devtool: "nosources-source-map",
  externals: [nodeExternals()],
  output: {
    path: outputDirectory,
    filename: "[name].js",
    libraryTarget: "commonjs2",
    sourceMapFilename: "[file].map"
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [new CleanWebpackPlugin(outputDirectory)]
};
