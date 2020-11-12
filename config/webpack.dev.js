const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const Webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  module: {
    rules: [
      {
        test: /.[jt]sx?$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "eslint-loader",
      },
    ],
  },
  optimization: {
    emitOnErrors: false,
  },
  plugins: [
    new StylelintPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ],
};
