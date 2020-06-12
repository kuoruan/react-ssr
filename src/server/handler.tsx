import App from "@/App";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import Express from "express";
import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import Helmet from "react-helmet";
import { StaticRouter } from "react-router-dom";

import Html from "./Html";

type Context = {
  url?: string;
};

if (module.hot) {
  module.hot.accept(["@/App", "./Html"], () => {
    console.log("🔁 Server-side HMR Reloading...");
  });

  console.info("✅ Server-side HMR Enabled!");
} else {
  console.info("❌ Server-side HMR Not Supported.");
}

export default function createHandler(
  statsFile: string
): Express.RequestHandler {
  return (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const clientExtractor = new ChunkExtractor({
      statsFile: statsFile,
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
  };
}
