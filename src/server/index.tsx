import path from "path";

import App from "@/App";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import Express from "express";
import PortFinder from "portfinder";
import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import Helmet from "react-helmet";
import { StaticRouter } from "react-router-dom";

import Html from "./Html";

const { clientDir, statsFilename } = require("#/config/conf");

type Context = {
  url?: string;
};

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

app.get("*", function (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  const clientExtractor = new ChunkExtractor({
    statsFile: clientStats,
  });

  const context: Context = {};

  const markup = renderToString(
    <ChunkExtractorManager extractor={clientExtractor}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </ChunkExtractorManager>
  );

  if (context.url) {
    return res.redirect(301, context.url);
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
      />
    );

    res.set("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>${html}`);

    return next();
  }
});

const runPort = Number.isInteger(process.env.PORT)
  ? Number(process.env.PORT)
  : 8000;

PortFinder.getPort(
  {
    port: runPort,
  },
  (err, port) => {
    if (err) {
      console.error(err.message);
    } else {
      const server = app.listen(port, () => {
        const addr = server.address();

        if (addr) {
          let listen: string;

          if (typeof addr === "string") {
            listen = addr;
          } else {
            listen = `${addr.address}${addr.port}`;
          }
          console.log(`App listening on ${listen}...`);
        }

        console.log(`Build time: ${process.env.PACKAGE_BUILD_TIME}`);
      });

      if (module.hot) {
        module.hot.accept(["@/App", "./Html"], () => {
          console.log("🔁 Server-side HMR Reloading...");
        });

        console.info("✅ Server-side HMR Enabled!");
      } else {
        console.info("❌ Server-side HMR Not Supported.");
      }
    }
  }
);
