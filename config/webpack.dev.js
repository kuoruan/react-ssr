const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const Webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  module: {
    rules: [
      {
        enforce: "pre",
        test: /.(js|ts)x?$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
    ],
  },
  plugins: [
    new StylelintPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ],
};
