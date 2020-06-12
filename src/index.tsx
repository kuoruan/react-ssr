import { loadableReady } from "@loadable/component";
import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

loadableReady(() => {
  hydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("app")
  );
});

if (module.hot) {
  module.hot.accept("./App", () => {
    console.log("🔁 Client-side HMR Reloading...");
  });

  console.info("✅ Client-side HMR Enabled!");
} else {
  console.info("❌ Client-side HMR Not Supported.");
}
