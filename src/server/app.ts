import path from "path";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

import {
  serveGzipped,
  proxyApi,
  checkAuthCode,
  autoRefreshToken,
  revokeTokens,
  csrfProtection,
  csrfErrorHandler,
} from "./handlers";
import render from "./render";

const { clientDir, statsFilename } = require("/config/conf");

const staticBasePath = path.resolve(__dirname, `../${clientDir}`);

const clientStats = path.resolve(__dirname, `../${clientDir}/assets.json`);

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

  const { getClientWebpackConfig } = require("/config/utils");
  const webpackConfig = getClientWebpackConfig(true);

  const compiler = webpack(webpackConfig);

  app.use(
    devMiddleware(compiler, {
      // silent log, use `friendly-errors-webpack-plugin`
      serverSideRender: true,

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

const authRouter = express.Router();

// add api to get and set tokens
authRouter.post(
  "/check",
  bodyParser.json(),
  checkAuthCode(
    `${process.env.APP_API_HOST}${process.env.APP_API_BASE_PATH}/auth/token`
  )
);

authRouter.delete("/logout", revokeTokens());

app.use("/api/auth", authRouter);

// auto refresh token when needed
app.use(
  autoRefreshToken(
    `${process.env.APP_API_HOST}${process.env.APP_API_BASE_PATH}/auth/token/refresh`
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
