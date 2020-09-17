function isWebTarget(caller) {
  return Boolean(caller && caller.target === "web");
}

function isNodeTarget(caller) {
  return Boolean(caller && caller.target === "node");
}

module.exports = (api) => {
  const isDevelopment = api.env("development");

  const isWeb = api.caller(isWebTarget);
  const isNode = api.caller(isNodeTarget);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
          useBuiltIns: isWeb ? "usage" : undefined,
          corejs: isWeb ? 3 : false,
          targets: isNode ? { node: "current" } : undefined,
          ignoreBrowserslistConfig: isNode,
        },
      ],
      [
        "@babel/preset-typescript",
        {
          // for fork-ts-checker-webpack-plugin
          onlyRemoveTypeImports: true,
        },
      ],
      "@babel/preset-react",
    ],
    plugins: [
      isDevelopment && isWeb && "react-refresh/babel",
      "@loadable/babel-plugin",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-async-generator-functions",
      "@babel/plugin-transform-runtime",
      "@babel/plugin-transform-typescript",
    ].filter(Boolean),
  };
};
