const path = require("path");

const { merge } = require("webpack-merge");
const NodeExternals = require("webpack-node-externals");

const { assetsDir, rootPath } = require("../conf");
const webpackProd = require("../webpack.prod");
const webpackBase = require("./webpack.config.base");

module.exports = merge(webpackBase, webpackProd, {
  entry: {
    server: path.join(rootPath, "./src/server/index.ts"),
  },
  output: {
    chunkFilename: path.join(
      assetsDir,
      "js",
      "[name].[contenthash:7].chunk.js"
    ),
  },
  externals: [NodeExternals()],
});
