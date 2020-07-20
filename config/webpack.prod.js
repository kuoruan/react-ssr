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
          compress: true,
          mangle: true,
          output: {
            preamble: `// Copyright 2019-${new Date().getFullYear()} XXX. All Rights Reserved.`,
            comments: /@license/i,
          },
        },
        extractComments: false,
        parallel: true,
        cache: true,
      }),
    ],
  },
};
