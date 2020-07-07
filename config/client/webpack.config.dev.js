const path = require("path");

const { merge } = require("webpack-merge");

const { assetsDir, rootPath } = require("../conf");
const webpackDev = require("../webpack.dev");
const webpackBase = require("./webpack.config.base");

module.exports = merge(webpackBase, webpackDev, {
  entry: [
    "webpack-hot-middleware/client",
    path.join(rootPath, "./src/index.tsx"),
  ],
  output: {
    filename: path.join(assetsDir, "js", "[name].js"),
    chunkFilename: path.join(assetsDir, "js", "[name].chunk.js"),
  },
});
