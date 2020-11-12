const path = require("path");

// const StartServerPlugin = require("start-server-webpack-plugin");
const StartServerPlugin = require("razzle-start-server-webpack-plugin");
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
      // load non-javascript files with extensions
      // https://github.com/liady/webpack-node-externals#how-can-i-bundle-required-assets-ie-css-files-from-node_modules
      allowlist: ["webpack/hot/signal", /\.(?!(?:jsx?|json)$).{1,5}$/i],
    }),
  ],
  plugins: [
    new StartServerPlugin({
      entryName: "server",
      restartable: true,
      verbose: false,
    }),
  ],
});
