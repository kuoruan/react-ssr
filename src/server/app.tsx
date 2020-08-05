import path from "path";

import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import Express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import Helmet from "react-helmet";
import { Provider as ReduxProvider } from "react-redux";
import { StaticContext } from "react-router";
import { StaticRouter } from "react-router-dom";

import Api from "@/api";
import App from "@/App";
import configureHistory from "@/configure/history";
import routes from "@/routes";
import { matchRoutes } from "@/routes/utils";
import initStore from "@/store";

import serveGzipped from "./gzip";
import Html from "./Html";

interface ServerRouterContext extends StaticContext {
  url?: string;
}

const { clientDir, statsFilename } = require("#/config/conf");

const staticBasePath = path.resolve(__dirname, `../${clientDir}`);

const clientStats = path.resolve(__dirname, `../${clientDir}/${statsFilename}`);

const app = Express();

app.get("*.js", serveGzipped(staticBasePath, "text/javascript"));
app.get("*.css", serveGzipped(staticBasePath, "text/css"));

app.use(Express.static(staticBasePath));

if (process.env.NODE_ENV === "development") {
  // add error handler
  const errorhandler = require("errorhandler");
  app.use(errorhandler());

  // add dev and hot middlewares
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
  app.use(
    HotMiddleware(compiler, {
      log: false,
    })
  );
}

// add csurf middleware to avoid CSRF attack
app.use(cookieParser());
app.use(
  csurf({
    cookie: {
      key: "_csrf",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
    value: (req) => String(req.headers["X-CSRF-Token"]),
  })
);

app.use(
  (
    err: any,
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    if (err.code !== "EBADCSRFTOKEN") {
      return next(err);
    }

    res.status(403);
    res.json({ code: -1, message: "invalid csrf token" });
  }
);

const COOKIE_TOKEN_KEY = "_token";

// add a filter proxy to all api
app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.APP_API_PROXY_TARGET,
    pathRewrite: {
      "^/api": process.env.APP_API_BASE_SERVER ?? "",
    },
    selfHandleResponse: true,
    onError: (err, req, res) => {
      res.status(500);
      res.json({ code: -1, message: "internal server error" });
    },
    onProxyReq: (proxyReq, req, res) => {
      let token;
      // get the access token from cookie and add it to the request header
      if ((token = req.cookies[COOKIE_TOKEN_KEY])) {
        proxyReq.setHeader("Authorization", `Bearer ${token}`);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // extract JWT access token from login api response
      if (
        req.path === process.env.APP_API_LOGIN_PATH &&
        proxyRes.statusCode === 200
      ) {
        let originalBody = Buffer.from("", "utf-8");

        proxyRes.on("data", function (data) {
          originalBody = Buffer.concat([originalBody, data]);
        });

        proxyRes.on("end", function () {
          const body = originalBody.toString();

          const json = JSON.parse(body);

          // set the token cookie to client
          // use httpOnly to disallow javascript access to the token
          res.cookie(COOKIE_TOKEN_KEY, json.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          proxyRes.pipe(res);
        });
      } else {
        proxyRes.pipe(res);
      }
    },
  })
);

app.get("*", async (req, res, next) => {
  const url = req.url;

  const token = req.cookies[COOKIE_TOKEN_KEY];

  // create api object for server
  const api = new Api(
    `${process.env.APP_API_PROXY_TARGET}${process.env.APP_API_BASE_SERVER}`,
    token
  );

  const history = configureHistory(url);
  const store = initStore(history, api, { system: { csrf: req.csrfToken() } });

  const branch = matchRoutes(routes, req.path);

  const promises: Promise<void>[] = branch.map(({ route, match }) => {
    return route.component?.fetchData
      ? route.component.fetchData({
          url: url,
          pathname: req.path,
          params: match.params,
          query: req.query,
          store: store,
        })
      : Promise.resolve();
  });

  await Promise.allSettled(promises);

  const clientExtractor = new ChunkExtractor({
    statsFile: clientStats,
  });

  const context: ServerRouterContext = {};

  const markup = renderToString(
    <ChunkExtractorManager extractor={clientExtractor}>
      <ReduxProvider store={store}>
        <StaticRouter location={url} context={context}>
          <App />
        </StaticRouter>
      </ReduxProvider>
    </ChunkExtractorManager>
  );

  if (context.statusCode && context.url) {
    return res.redirect(context.statusCode, context.url);
  } else {
    const linkElements = clientExtractor.getLinkElements();
    const styleElements = clientExtractor.getStyleElements();
    const scriptElements = clientExtractor.getScriptElements();

    const helmet = Helmet.renderStatic();
    const htmlAttributes = helmet.htmlAttributes.toComponent();
    const bodyAttributes = helmet.bodyAttributes.toComponent();
    const titleComponent = helmet.title.toComponent();
    const metaComponent = helmet.meta.toComponent();
    const linkComponent = helmet.link.toComponent();

    const preloadedState = store.getState();

    const html = renderToStaticMarkup(
      <Html
        htmlAttributes={htmlAttributes}
        bodyAttributes={bodyAttributes}
        titleNode={titleComponent}
        metaNode={metaComponent}
        linkNodes={[linkComponent, ...linkElements]}
        styleNodes={styleElements}
        scriptNodes={scriptElements}
        content={markup}
        preloadedState={preloadedState}
      />
    );

    if (context.statusCode) {
      res.status(context.statusCode);
    } else {
      res.status(200);
    }
    res.set("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>${html}`);
  }

  return next();
});

if (module.hot) {
  module.hot.accept(["@/App", "@/routes"], () => {
    console.log("🔁 Server-side HMR Reloading...");
  });

  console.info("✅ Server-side HMR Enabled!");
}

export default app;
