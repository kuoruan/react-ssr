module.exports.getClientWebpackConfig = function (isDev = false) {
  return isDev
    ? require("./client/webpack.config.dev")
    : require("./client/webpack.config.prod");
};

module.exports.getServerWebpackConfig = function (isDev = false) {
  return isDev
    ? require("./server/webpack.config.dev")
    : require("./server/webpack.config.prod");
};
