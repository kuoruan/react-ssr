import "whatwg-fetch";
import { loadableReady } from "@loadable/component";
import { ConnectedRouter } from "connected-react-router";
import Qs from "qs";
import React from "react";
import { hydrate } from "react-dom";
import { Provider as ReduxProvider } from "react-redux";

import configureHistory from "@/configure/history";
import routes from "@/routes";
import { matchRoutes } from "@/routes/utils";
import * as serviceWorker from "@/serviceWorker";
import initStore from "@/store";

import App from "./App";

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const history = configureHistory();
const store = initStore(history, preloadedState);

history.listen((loc) => {
  const branch = matchRoutes(routes, loc.pathname);

  const promises: Promise<void>[] = branch.map(({ route, match }) => {
    return route.component?.fetchData
      ? route.component.fetchData({
          url: `${loc.pathname}${loc.search}${loc.hash}`,
          pathname: loc.pathname,
          params: match.params,
          query: Qs.parse(loc.search, { ignoreQueryPrefix: true }),
          store: store,
        })
      : Promise.resolve();
  });

  Promise.allSettled(promises);
});

loadableReady(() => {
  const render = () => {
    hydrate(
      <ReduxProvider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </ReduxProvider>,
      document.getElementById("app")
    );
  };

  render();

  if (module.hot) {
    module.hot.accept("./App", () => {
      console.log("🔁 Client-side HMR Reloading...");

      render();
    });

    console.info("✅ Client-side HMR Enabled!");
  }
});

serviceWorker.register();
