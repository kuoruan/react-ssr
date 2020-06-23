import path from "path";

import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import Express from "express";
import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import Helmet from "react-helmet";
import { StaticContext } from "react-router";
import { StaticRouter } from "react-router-dom";

import App from "@/App";
import routes from "@/routes";
import { matchRoutes } from "@/routes/utils";

import Html from "./Html";

interface ServerRouterContext extends StaticContext {
  url?: string;
}

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

app.get("*", async (req, res, next) => {
  const branch = matchRoutes(routes, req.path);

  const promises: Promise<void>[] = branch.map(({ route, match }) => {
    return route.component?.serverFetch
      ? route.component.serverFetch(match, req.query, req.url)
      : Promise.resolve();
  });

  await Promise.allSettled(promises);

  const clientExtractor = new ChunkExtractor({
    statsFile: clientStats,
  });

  const context: ServerRouterContext = {};

  const markup = renderToString(
    <ChunkExtractorManager extractor={clientExtractor}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
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
        preloadedState={{}}
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