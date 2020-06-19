import app from "./app";
import { parseArgs, getRunPort } from "./utils";

// polyfill fetch
if (!globalThis.fetch) {
  const fetch = require("node-fetch");
  globalThis.fetch = fetch;
}

const commandArgs = parseArgs();

getRunPort(String(commandArgs.port), 8000)
  .then((port) => {
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
      console.log(`Current time: ${new Date().toUTCString()}`);
    });
  })
  .catch((e) => {
    console.error(e);
  });
