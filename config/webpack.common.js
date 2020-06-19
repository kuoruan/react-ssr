const path = require("path");

const Webpack = require("webpack");

const { assetsDir, rootPath } = require("./conf");
const { stringified } = require("./env");

module.exports = {
  resolve: {
    alias: {
      "@": path.join(rootPath, "./src"),
      "#": rootPath,
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
        exclude: [/node_modules/],
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: {
          loader: "source-map-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: path.join(assetsDir, "img", "[name].[hash:8].[ext]"),
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[hash:8].[ext]"),
        },
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "@svgr/webpack",
          },
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: path.join(assetsDir, "img", "[name].[hash:8].[ext]"),
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: path.join(assetsDir, "fonts", "[hash:8].[ext]"),
            },
          },
        ],
      },
    ],
  },
  plugins: [new Webpack.DefinePlugin(stringified)],
  stats: {
    cached: false,
    cachedAssets: false,
    children: false,
    chunkModules: false,
    chunks: false,
    colors: true,
    entrypoints: false,
    hash: false,
    modules: false,
    reasons: false,
    timings: true,
    version: false,
  },
};
