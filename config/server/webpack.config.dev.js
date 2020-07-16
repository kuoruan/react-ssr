const path = require("path");

const StartServerPlugin = require("start-server-webpack-plugin");
const { merge } = require("webpack-merge");
const NodeExternals = require("webpack-node-externals");

const { assetsDir, rootPath } = require("../conf");
const webpackDev = require("../webpack.dev");
const webpackBase = require("./webpack.config.base");

// https://docs.nestjs.com/recipes/hot-reload

module.exports = merge(webpackBase, webpackDev, {
  entry: {
    server: [
      "webpack/hot/signal",
      path.join(rootPath, "./src/server/index.ts"),
    ],
  },
  output: {
    chunkFilename: path.join(assetsDir, "js", "[name].chunk.js"),
  },
  externals: [
    NodeExternals({
      allowlist: ["webpack/hot/signal"],
    }),
  ],
  plugins: [
    new StartServerPlugin({
      name: "server.js",
      signal: true,
    }),
  ],
});
