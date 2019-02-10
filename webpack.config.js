const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const outputDirectory = path.join(__dirname, "dist");

module.exports = [
  {
    name: "host",
    mode: "development",
    context: __dirname,
    target: "node",
    entry: ["./src/index.js"],
    output: {
      path: outputDirectory,
      filename: "index.js"
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js/,
          exclude: /node_modules/,
          loader: "eslint-loader"
        },
        {
          test: /\.js/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    },
    externals: { "node-rdkafka": "commonjs node-rdkafka" },
    plugins: [
      new CleanWebpackPlugin(outputDirectory),
      new CopyWebpackPlugin([
        {
          from: "./package.json",
          to: "./package.json"
        },
        {
          from: "./node_modules/node-rdkafka/package.json",
          to: "./node_modules/node-rdkafka/package.json"
        },
        {
          from:
            "./node_modules/node-rdkafka/build/Release/node-librdkafka.node",
          to: "./node_modules/node-rdkafka/build/Release/node-librdkafka.node"
        },
        {
          from: "./node_modules/bindings",
          to: "./node_modules/bindings"
        }
      ])
    ]
  }
];
