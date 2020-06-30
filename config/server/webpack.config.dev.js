const path = require("path");

const StartServerPlugin = require("start-server-webpack-plugin");
const Merge = require("webpack-merge");
const NodeExternals = require("webpack-node-externals");

const { assetsDir, rootPath } = require("../conf");
const webpackDev = require("../webpack.dev");
const webpackBase = require("./webpack.config.base");

// https://docs.nestjs.com/recipes/hot-reload

module.exports = Merge(webpackBase, webpackDev, {
  entry: {
    server: [
      "webpack/hot/poll?1000",
      path.join(rootPath, "./src/server/index.ts"),
    ],
  },
  output: {
    chunkFilename: path.join(assetsDir, "js", "[name].chunk.js"),
  },
  module: {
    rules: [
      {
        test: /\.s?(a|c)ss$/,
        loader: "null-loader", // ignore css files in dev, insert styles with client style-loader
      },
    ],
  },
  externals: [
    NodeExternals({
      whitelist: ["webpack/hot/poll?1000"],
    }),
  ],
  plugins: [
    new StartServerPlugin({
      name: "server.js",
      signal: true,
    }),
  ],
});
