function isWebTarget(caller) {
  return Boolean(caller && caller.target === "web");
}

module.exports = (api) => {
  const web = api.caller(isWebTarget);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
          useBuiltIns: web ? "usage" : undefined,
          corejs: web ? 3 : false,
        },
      ],
      "@babel/preset-typescript",
      "@babel/preset-react",
    ],
    plugins: [
      "@loadable/babel-plugin",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-async-generator-functions",
      "@babel/plugin-transform-runtime",
      "@babel/plugin-transform-typescript",
    ],
  };
};
