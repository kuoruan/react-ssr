const path = require("path");

const LoadablePlugin = require("@loadable/webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Webpack = require("webpack");
const Merge = require("webpack-merge");

const {
  clientDir,
  statsFilename,
  distDir,
  publicPath,
  rootPath,
} = require("../conf");
const { raw } = require("../env");
const webpackCommon = require("../webpack.common");

const isProduction = raw.NODE_ENV === "production";

module.exports = Merge(webpackCommon, {
  name: "client",
  target: "web",
  output: {
    path: path.join(rootPath, distDir, clientDir),
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(scss|sass)$/,
        exclude: [/node_modules/],
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
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
