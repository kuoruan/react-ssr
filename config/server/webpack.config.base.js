const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Webpack = require("webpack");
const Merge = require("webpack-merge");

const { distDir, serverDir, publicPath, rootPath } = require("../conf");
const webpackCommon = require("../webpack.common");

module.exports = Merge(webpackCommon, {
  name: "server",
  target: "node",
  output: {
    path: path.join(rootPath, distDir, serverDir),
    publicPath: publicPath,
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
  plugins: [
    new Webpack.DefinePlugin({
      __isClient__: "false",
      __isServer__: "true",
    }),
    new CleanWebpackPlugin(),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
});
