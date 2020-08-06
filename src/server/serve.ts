import fs from "fs";

import { ServeMiddleware } from "./types";

export function serveGzipped(
  basepath: string,
  contentType: string
): ServeMiddleware {
  return (req, res, next) => {
    const acceptedEncodings = req.acceptsEncodings();
    if (
      acceptedEncodings.indexOf("gzip") < 0 ||
      !fs.existsSync(`${basepath}/${req.url}.gz`)
    ) {
      next();
      return;
    }

    req.url += ".gz";

    res.set("Content-Encoding", "gzip");
    res.set("Content-Type", contentType);

    next();
  };
}
