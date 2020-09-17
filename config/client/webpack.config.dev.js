const path = require("path");

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { merge } = require("webpack-merge");

const { assetsDir, rootPath } = require("../conf");
const webpackDev = require("../webpack.dev");
const webpackBase = require("./webpack.config.base");

// react-refresh
// https://github.com/facebook/react/issues/16604#issuecomment-528663101

module.exports = merge(webpackBase, webpackDev, {
  entry: [
    "webpack-hot-middleware/client",
    path.join(rootPath, "./src/index.tsx"),
  ],
  output: {
    filename: path.join(assetsDir, "js", "[name].js"),
    chunkFilename: path.join(assetsDir, "js", "[name].chunk.js"),
  },
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: "whm",
      },
    }),
  ],
});
