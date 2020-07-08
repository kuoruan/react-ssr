import app from "./app";
import { parseArgs, getRunPort } from "./utils";

// Polyfill fetch, server side
if (!globalThis.fetch) {
  const fetch = require("node-fetch");
  globalThis.fetch = fetch;
}

const commandArgs = parseArgs();

getRunPort(String(commandArgs.port), 8000)
  .then((port) => {
    const server = app.listen(port, () => {
      let addr;

      if ((addr = server.address())) {
        let listen: string;

        if (typeof addr === "string") {
          listen = addr;
        } else {
          if (addr.family === "IPv6") {
            listen = `[${addr.address}]:${addr.port}`;
          } else {
            listen = `${addr.address}:${addr.port}`;
          }
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
