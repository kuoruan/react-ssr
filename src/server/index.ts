import path from "path";

import Express from "express";

import createHandler from "./handler";

const { clientDir, statsFilename } = require("#/config/conf");

const app = Express();

app.use(Express.static(path.resolve(__dirname, `../${clientDir}`)));

if (process.env.NODE_ENV === "development") {
  const Webpack = require("webpack");
  const DevMiddleware = require("webpack-dev-middleware");
  const HotMiddleware = require("webpack-hot-middleware");

  const { getClientWebpackConfig } = require("#/config/utils");
  const webpackConfig = getClientWebpackConfig(true);

  const compiler = Webpack(webpackConfig);

  app.use(
    DevMiddleware(compiler, {
      // silent log, use `friendly-errors-webpack-plugin`
      logLevel: "silent",
      writeToDisk(filePath: string) {
        return filePath.endsWith(statsFilename);
      },
    })
  );
  app.use(HotMiddleware(compiler));
}

const clientStats = path.resolve(__dirname, `../${clientDir}/${statsFilename}`);

app.get("*", createHandler(clientStats));

const port = process.env.PORT || 1000;

app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
  console.log(`Build time: ${process.env.PACKAGE_BUILD_TIME}...`);
});
