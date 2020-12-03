import "whatwg-fetch";
import { ConnectedRouter } from "connected-react-router";
import Qs from "qs";
import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";

import App from "@/App";
import configureApi from "@/configure/api";
import configureHistory from "@/configure/history";
import routes from "@/routes";
import { matchRoutes } from "@/routes/utils";
import * as serviceWorker from "@/serviceWorker";
import initStore from "@/store";

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

// create api object for client
const api = configureApi({ csrfToken: preloadedState.system?.csrf });
const history = configureHistory();

const store = initStore(history, api, preloadedState);

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

ReactDOM.hydrate(
  <ReduxProvider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </ReduxProvider>,
  document.getElementById("app")
);

serviceWorker.register();
