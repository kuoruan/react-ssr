const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Webpack = require("webpack");

const { assetsDir, rootPath } = require("./conf");
const { raw, stringified } = require("./env");

const isEnvProduction = raw.NODE_ENV === "production";

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
            cacheCompression: isEnvProduction,
            compact: isEnvProduction,
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
        test: /\.css$/,
        use: [
          isEnvProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          isEnvProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              prependData: `@import "@/assets/scss/variables.scss";`,
            },
          },
        ],
        exclude: [/node_modules/],
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
        test: /\.woff(2)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: path.join(assetsDir, "fonts", "[hash:8].[ext]"),
              mimetype: "application/font-woff",
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
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: false,
    timings: true,
    version: false,
  },
};
