const path = require("path");

const LoadablePlugin = require("@loadable/webpack-plugin");
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
  statsFilename,
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
    new Webpack.DefinePlugin({
      __isClient__: "true",
      __isServer__: "false",
    }),
    new LoadablePlugin({ filename: statsFilename }),
    new CopyPlugin({
      patterns: [
        {
          from: "**/*",
          context: path.join(rootPath, "public"),
          noErrorOnMissing: true,
        },
      ],
    }),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
  node: {
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
  },
});
