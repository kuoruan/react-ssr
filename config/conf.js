const appConfig = require("../app.config");

const baseConfig = {
  rootPath: process.cwd(),
  distDir: "dist",
  clientDir: "client",
  serverDir: "server",
  assetsDir: "static",
  publicPath: "/",
  sassAdditionalData: "",
  statsFilename: "loadable-stats.json",
};

module.exports = Object.assign({}, baseConfig, appConfig);
