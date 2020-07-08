const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { merge } = require("webpack-merge");

const { assetsDir, rootPath } = require("../conf");
const webpackProd = require("../webpack.prod");
const webpackBase = require("./webpack.config.base");

module.exports = merge(webpackBase, webpackProd, {
  entry: path.join(rootPath, "./src/index.tsx"),
  output: {
    filename: path.join(assetsDir, "js", "[name].[contenthash:7].js"),
    chunkFilename: path.join(
      assetsDir,
      "js",
      "[name].[contenthash:7].chunk.js"
    ),
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          priority: 10,
        },
        vendors: {
          test: /node_modules/,
          priority: -10,
          name: "vendors",
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join(assetsDir, "css", "[name].[contenthash:7].css"),
      chunkFilename: path.join(
        assetsDir,
        "css",
        "[name].[contenthash:7].chunk.css"
      ),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true,
    }),
  ],
});
