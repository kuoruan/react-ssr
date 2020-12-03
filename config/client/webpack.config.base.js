const path = require("path");

const AssetsPlugin = require("assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Webpack = require("webpack");
const { merge } = require("webpack-merge");

const {
  clientDir,
  distDir,
  publicPath,
  rootPath,
  sassAdditionalData,
} = require("../conf");
const { raw } = require("../env");
const webpackCommon = require("../webpack.common");

const isDevelopment = raw.NODE_ENV !== "production";

module.exports = merge(webpackCommon, {
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
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        exclude: /node_modules/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              additionalData: sassAdditionalData,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Webpack.DefinePlugin({
      __isClient__: "true",
      __isServer__: "false",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "**/*",
          context: path.join(rootPath, "public"),
          noErrorOnMissing: true,
        },
      ],
    }),
    new ForkTsCheckerWebpackPlugin(),
    new AssetsPlugin({
      filename: "assets.json",
      includeAllFileTypes: false,
      entrypoints: true,
      useCompilerPath: true,
    }),
  ],
});
