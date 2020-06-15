const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Webpack = require("webpack");
const Merge = require("webpack-merge");

const { distDir, serverDir, publicPath, rootPath } = require("../conf");
const { raw } = require("../env");
const webpackCommon = require("../webpack.common");

const isProduction = raw.NODE_ENV === "production";

module.exports = Merge(webpackCommon, {
  name: "server",
  target: "node",
  output: {
    path: path.join(rootPath, distDir, serverDir),
    publicPath: publicPath,
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "null-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(scss|sass)$/,
        exclude: [/node_modules/],
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "null-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              prependData: `@import "@/assets/scss/variables.scss";`,
            },
          },
        ],
      },
    ],
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
