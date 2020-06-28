import "whatwg-fetch";
import { loadableReady } from "@loadable/component";
import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { hydrate } from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import configureHistory from "@/configure/history";
import initStore from "@/store";

import App from "./App";

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const history = configureHistory();
const store = initStore(history, preloadedState);

loadableReady(() => {
  const render = () => {
    hydrate(
      <BrowserRouter>
        <ReduxProvider store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </ReduxProvider>
      </BrowserRouter>,
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
