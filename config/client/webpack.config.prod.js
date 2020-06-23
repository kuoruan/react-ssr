const path = require("path");

const Merge = require("webpack-merge");

const { assetsDir, rootPath } = require("../conf");
const webpackProd = require("../webpack.prod");
const webpackBase = require("./webpack.config.base");

module.exports = Merge(webpackBase, webpackProd, {
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
          enforce: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/](!react)(!react-dom)[\\/]/,
          name: "vendor",
        },
      },
    },
  },
});
