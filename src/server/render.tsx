import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import { RequestHandler } from "express";
import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import Helmet from "react-helmet";
import { Provider as ReduxProvider } from "react-redux";
import { StaticContext } from "react-router";
import { StaticRouter } from "react-router-dom";

import App from "@/App";
import configureApi from "@/configure/api";
import configureHistory from "@/configure/history";
import routes from "@/routes";
import { matchRoutes } from "@/routes/utils";
import initStore from "@/store";

import Html from "./Html";
import { COOKIE_ACCESS_TOKEN_KEY } from "./types";

export default function render(statsFile: string): RequestHandler {
  if (module.hot) {
    module.hot.accept(["@/App", "@/routes"], () => {
      console.log("🔁 Server-side HMR Reloading...");
    });

    console.info("✅ Server-side HMR Enabled!");
  }

  return async (req, res) => {
    const url = req.url;

    const accessToken = req.cookies[COOKIE_ACCESS_TOKEN_KEY];

    // create api object for server
    const api = configureApi({ accessToken: accessToken });
    const history = configureHistory(url);

    const store = initStore(history, api, {
      system: { csrf: req.csrfToken() },
    });

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
      statsFile: statsFile,
    });

    const context: StaticContext & {
      url?: string;
    } = {};

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
      res.redirect(context.statusCode, context.url);
      return;
    }

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
        {...htmlAttributes}
        bodyProps={bodyAttributes}
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
    res.set("Content-Type", "text/html").send(`<!DOCTYPE html>${html}`);
  };
}
