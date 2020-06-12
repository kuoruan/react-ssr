const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const { assetsDir } = require("./conf");

module.exports = {
  mode: "production",
  devtool: "nosources-source-map",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            preamble: `// Copyright 2019-${new Date().getFullYear()} Opera Inc. All Rights Reserved.`,
            comments: /@license/i,
            ascii_only: true,
          },
        },
        extractComments: false,
        parallel: true,
        cache: true,
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join(assetsDir, "css", "[name].[contenthash:8].css"),
      chunkFilename: path.join(
        assetsDir,
        "css",
        "[name].[contenthash:8].chunk.css"
      ),
    }),
  ],
};
