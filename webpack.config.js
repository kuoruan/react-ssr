const {
  getClientWebpackConfig,
  getServerWebpackConfig,
} = require("./config/utils");

module.exports = function (env = {}, argv) {
  const { dev = false, server = false, ...restEnv } = env;
  if (dev) {
    process.env.NODE_ENV = "development";
  } else {
    process.env.NODE_ENV = "production";
  }

  for (const key in restEnv) {
    process.env[key] = env[key];
  }

  return server ? getServerWebpackConfig(dev) : getClientWebpackConfig(dev);
};
