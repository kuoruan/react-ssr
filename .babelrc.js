function isWebTarget(caller) {
  return Boolean(caller && caller.target === "web");
}

function isNodeTarget(caller) {
  return Boolean(caller && caller.target === "node");
}

module.exports = (api) => {
  const web = api.caller(isWebTarget);
  const node = api.caller(isNodeTarget);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
          useBuiltIns: web ? "usage" : undefined,
          corejs: web ? 3 : false,
          targets: node ? { node: "current" } : undefined,
          ignoreBrowserslistConfig: node,
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
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-async-generator-functions",
      "@babel/plugin-transform-runtime",
      "@babel/plugin-transform-typescript",
    ],
  };
};
