const path = require("path");

const StartServerPlugin = require("start-server-webpack-plugin");
const Merge = require("webpack-merge");
const NodeExternals = require("webpack-node-externals");

const webpackBase = require("./webpack.config.base");

const { assetsDir, rootPath } = require("../conf");
const webpackDev = require("../webpack.dev");

module.exports = Merge(webpackBase, webpackDev, {
  entry: {
    server: [
      "webpack/hot/poll?1000",
      path.join(rootPath, "./src/server/index.ts"),
    ],
  },
  output: {
    chunkFilename: path.join(assetsDir, "js", "[name].chunk.js"),
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
  },
  externals: [
    NodeExternals({
      whitelist: ["webpack/hot/poll?1000"],
    }),
  ],
  plugins: [
    new StartServerPlugin({
      name: "server.js",
    }),
  ],
});
