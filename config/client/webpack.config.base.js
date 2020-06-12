const path = require("path");

const LoadablePlugin = require("@loadable/webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Webpack = require("webpack");
const Merge = require("webpack-merge");

const {
  clientDir,
  statsFilename,
  distDir,
  publicPath,
  rootPath,
} = require("../conf");
const webpackCommon = require("../webpack.common");

module.exports = Merge(webpackCommon, {
  name: "client",
  target: "web",
  output: {
    path: path.join(rootPath, distDir, clientDir),
    publicPath: publicPath,
  },
  plugins: [
    new Webpack.DefinePlugin({
      __isClient__: "true",
      __isServer__: "false",
    }),
    new LoadablePlugin({ filename: statsFilename }),
    new CopyPlugin({
      patterns: [path.join(rootPath, "public")],
    }),
    new CleanWebpackPlugin(),
  ],
});
