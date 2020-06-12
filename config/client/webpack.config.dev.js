const path = require("path");

const Merge = require("webpack-merge");

const webpackBase = require("./webpack.config.base");

const { assetsDir, rootPath } = require("../conf");
const webpackDev = require("../webpack.dev");

module.exports = Merge(webpackBase, webpackDev, {
  entry: [
    "webpack-hot-middleware/client?name=client",
    path.join(rootPath, "./src/index.tsx"),
  ],
  output: {
    filename: path.join(assetsDir, "js", "[name].js"),
    chunkFilename: path.join(assetsDir, "js", "[name].chunk.js"),
  },
});
