import "whatwg-fetch";
import { loadableReady } from "@loadable/component";
import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

loadableReady(() => {
  const render = () => {
    const data = window.__PRELOADED_STATE__;

    // Allow the passed state to be garbage-collected
    delete window.__PRELOADED_STATE__;

    hydrate(
      <BrowserRouter>
        <App />
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
