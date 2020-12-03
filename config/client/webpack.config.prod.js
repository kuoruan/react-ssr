const path = require("path");

const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { merge } = require("webpack-merge");
const WorkboxPlugin = require("workbox-webpack-plugin");

const { assetsDir, rootPath } = require("../conf");
const { raw } = require("../env");
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
        redux: {
          test: /[\\/]node_modules[\\/](redux|react-redux|redux-thunk)[\\/]/,
          name: "redux",
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
      statsFilename: "bundle-stats.json",
    }),
    new CompressionPlugin({
      algorithm: "gzip",
      filename: "[path][base].gz[query]",
      test: /\.(js|css)$/,
      minRatio: 0.8,
      threshold: 8192,
    }),
    new WorkboxPlugin.GenerateSW({
      swDest: "sw.js",
      sourcemap: false,
      exclude: [/\.map$/, /.gz$/, /stats.json$/],
      navigateFallback: `${raw.PUBLIC_URL}/index.html`,
      navigateFallbackDenylist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp("^/_"),
        // Exclude URLs containing a dot, as they're likely a resource in
        // public/ and not a SPA route
        new RegExp("/[^/]+\\.[^/]+$"),
      ],
    }),
  ],
});
