const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "nosources-source-map",
  performance: {
    hints: false,
  },
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
            preamble: `// Copyright 2019-${new Date().getFullYear()} XXX. All Rights Reserved.`,
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
};
