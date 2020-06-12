const path = require("path");

const Merge = require("webpack-merge");
const NodeExternals = require("webpack-node-externals");

const webpackBase = require("./webpack.config.base");

const { assetsDir } = require("../conf");
const webpackProd = require("../webpack.prod");

module.exports = Merge(webpackBase, webpackProd, {
  entry: {
    server: path.join(rootPath, "./src/server/index.ts"),
  },
  output: {
    chunkFilename: path.join(
      assetsDir,
      "js",
      "[name].[contenthash:8].chunk.js"
    ),
  },
  externals: [NodeExternals()],
});
