const path = require("path");

const Webpack = require("webpack");

const { assetsDir, rootPath } = require("./conf");
const { raw, stringified } = require("./env");

const isDevelopment = raw.NODE_ENV !== "production";

module.exports = {
  resolve: {
    alias: {
      "@": path.join(rootPath, "./src"),
    },
    roots: [rootPath],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: "source-map-loader",
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            name: path.join(
              assetsDir,
              "img",
              isDevelopment ? "[name].[ext]" : "[name].[contenthash:7].[ext]"
            ),
          },
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            name: path.join(
              assetsDir,
              "media",
              isDevelopment ? "[name].[ext]" : "[name].[contenthash:7].[ext]"
            ),
          },
        },
      },
      {
        test: /\.svg$/i,
        exclude: /node_modules/,
        use: [
          "@svgr/webpack",
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: path.join(
                assetsDir,
                "img",
                isDevelopment ? "[name].[ext]" : "[name].[contenthash:7].[ext]"
              ),
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: path.join(
                assetsDir,
                "fonts",
                isDevelopment ? "[name].[ext]" : "[name].[contenthash:7].[ext]"
              ),
            },
          },
        ],
      },
    ],
  },
  plugins: [new Webpack.DefinePlugin(stringified)],
  stats: {
    assets: false,
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
