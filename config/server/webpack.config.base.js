const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Webpack = require("webpack");
const { merge } = require("webpack-merge");

const { distDir, publicPath, rootPath, serverDir } = require("../conf");
const webpackCommon = require("../webpack.common");

module.exports = merge(webpackCommon, {
  name: "server",
  target: "node",
  output: {
    path: path.join(rootPath, distDir, serverDir),
    publicPath: publicPath,
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Webpack.DefinePlugin({
      __isClient__: "false",
      __isServer__: "true",
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
});
