import { loadableReady } from "@loadable/component";
import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

loadableReady(() => {
  const render = () => {
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
