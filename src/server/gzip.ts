import fs from "fs";

import { Request, Response, NextFunction } from "express";

const serveGzipped = (basepath: string, contentType: string) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export default serveGzipped;
