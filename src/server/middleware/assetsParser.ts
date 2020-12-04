import fs from "fs";

import { RequestHandler } from "express";

type Assets = Record<string, OAsset>;

export default function assetsParser(assetsFile: string): RequestHandler {
  let assets: Assets;

  try {
    const json = fs.readFileSync(assetsFile, "utf-8");
    assets = JSON.parse(json);
  } catch (e) {
    assets = {};
  }

  return (req, _, next) => {
    req.assets = assets.main || { js: [], css: [] };

    next();
  };
}
