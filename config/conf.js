const appConfig = require("../app.config");

const defaultConfig = {
  rootPath: process.cwd(),
  distDir: "dist",
  clientDir: "client",
  serverDir: "server",
  assetsDir: "static",
  publicPath: "/",
  sassAdditionalData: "",
};

module.exports = Object.assign({}, defaultConfig, appConfig);
