import path from "path";

import cookieParser from "cookie-parser";
import express from "express";

import {
  serveGzipped,
  proxyApi,
  checkAuthCode,
  refreshToken,
  csrfProtection,
  csrfErrorHandler,
} from "./handlers";
import render from "./render";

const { clientDir, statsFilename } = require("#/config/conf");

const staticBasePath = path.resolve(__dirname, `../${clientDir}`);

const clientStats = path.resolve(__dirname, `../${clientDir}/${statsFilename}`);

const app = express();

app.get("*.js", serveGzipped(staticBasePath, "text/javascript"));
app.get("*.css", serveGzipped(staticBasePath, "text/css"));

app.use(express.static(staticBasePath));

if (process.env.NODE_ENV === "development") {
  // add error handler
  const errorhandler = require("errorhandler");
  app.use(errorhandler());

  // add dev and hot middlewares
  const webpack = require("webpack");
  const devMiddleware = require("webpack-dev-middleware");
  const hotMiddleware = require("webpack-hot-middleware");

  const { getClientWebpackConfig } = require("#/config/utils");
  const webpackConfig = getClientWebpackConfig(true);

  const compiler = webpack(webpackConfig);

  app.use(
    devMiddleware(compiler, {
      // silent log, use `friendly-errors-webpack-plugin`
      logLevel: "silent",
      writeToDisk(filePath: string) {
        return filePath.endsWith(statsFilename);
      },
    })
  );
  app.use(
    hotMiddleware(compiler, {
      log: false,
    })
  );
}

app.use(cookieParser());

app.use(csrfProtection());
app.use(csrfErrorHandler());

// add api to get and set tokens
app.post(
  "/api/auth/check",
  checkAuthCode(
    `${process.env.APP_API_HOST}${process.env.APP_API_BASE_PATH}/token`
  )
);

app.post(
  "/api/auth/refresh",
  refreshToken(
    `${process.env.APP_API_HOST}${process.env.APP_API_BASE_PATH}/token:refresh`
  )
);

// add a filter proxy to all api
app.use(
  "/api",
  proxyApi(process.env.APP_API_HOST!, "/api", process.env.APP_API_BASE_PATH!)
);

// server side render
app.get("*", render(clientStats));

export default app;