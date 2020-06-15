import path from "path";

import Express from "express";
import PortFinder from "portfinder";

import createHandler from "./handler";

const { clientDir, statsFilename } = require("#/config/conf");

const app = Express();

app.use(Express.static(path.resolve(__dirname, `../${clientDir}`)));

if (process.env.NODE_ENV === "development") {
  const Webpack = require("webpack");
  const DevMiddleware = require("webpack-dev-middleware");
  const HotMiddleware = require("webpack-hot-middleware");

  const { getClientWebpackConfig } = require("#/config/utils");
  const webpackConfig = getClientWebpackConfig(true);

  const compiler = Webpack(webpackConfig);

  app.use(
    DevMiddleware(compiler, {
      // silent log, use `friendly-errors-webpack-plugin`
      logLevel: "silent",
      writeToDisk(filePath: string) {
        return filePath.endsWith(statsFilename);
      },
    })
  );
  app.use(HotMiddleware(compiler));
}

const clientStats = path.resolve(__dirname, `../${clientDir}/${statsFilename}`);

app.get("*", createHandler(clientStats));

const runPort = Number.isInteger(process.env.PORT)
  ? Number(process.env.PORT)
  : 8000;

PortFinder.getPort(
  {
    port: runPort,
  },
  (err, port) => {
    if (err) {
      console.error(err.message);
    } else {
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
      });
    }
  }
);
