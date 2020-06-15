import App from "@/App";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import Express from "express";
import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import Helmet from "react-helmet";
import { StaticRouter, StaticContext } from "react-router";

import Html from "./Html";

interface Context extends StaticContext {
  url?: string;
}

export default function (clientStatsFile: string): Express.RequestHandler {
  if (module.hot) {
    module.hot.accept(["@/App"], () => {
      console.log("🔁 Server-side HMR Reloading...");
    });

    console.info("✅ Server-side HMR Enabled!");
  }

  return function (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) {
    const clientExtractor = new ChunkExtractor({
      statsFile: clientStatsFile,
    });

    const context: Context = {};

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
        />
      );

      if (context.statusCode) {
        res.status(context.statusCode);
      } else {
        res.status(200);
      }
      res.set("Content-Type", "text/html");
      res.send(`<!DOCTYPE html>${html}`);

      return next();
    }
  };
}
