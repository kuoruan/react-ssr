import fs from "fs";

import csurf from "csurf";
import { RequestHandler, ErrorRequestHandler } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import * as http from "@/http";
import {
  HEADER_AUTHORIZATION,
  HEADER_REQUEST_ID,
  HEADER_CSRF_TOKEN,
} from "@/http/types";

import {
  COOKIE_REQUEST_ID_KEY,
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
  Tokens,
} from "./types";

export function serveGzipped(
  basePath: string,
  contentType: string
): RequestHandler {
  return (req, res, next) => {
    const acceptedEncodings = req.acceptsEncodings();
    if (
      acceptedEncodings.indexOf("gzip") < 0 ||
      !fs.existsSync(`${basePath}/${req.url}.gz`)
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

export function csrfProtection(): RequestHandler {
  return csurf({
    cookie: {
      key: "_csrf",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
    value: (req) => String(req.headers[HEADER_CSRF_TOKEN]),
  });
}

export function csrfErrorHandler(): ErrorRequestHandler {
  return (err, req, res, next) => {
    if (err.code !== "EBADCSRFTOKEN") {
      next(err);
      return;
    }

    res.status(403).json({ code: -1, message: "invalid csrf token" });
  };
}

export function proxyApi(
  targetHost: string,
  basePath: string,
  proxyPath: string
): RequestHandler {
  return createProxyMiddleware({
    target: targetHost,
    pathRewrite: (pahtname) => {
      return pahtname.replace(new RegExp(`^${basePath}`), proxyPath);
    },
    onError: (err, req, res) => {
      res.status(500).json({ code: -1, message: "internal server error" });
    },
    onProxyReq: (proxyReq, req, res) => {
      let token, requestId: string;
      // get the access token from cookie and add it to the request header
      if ((token = req.cookies[COOKIE_ACCESS_TOKEN_KEY])) {
        proxyReq.setHeader(HEADER_AUTHORIZATION, `Bearer ${token}`);
      }

      if ((requestId = req.cookies[COOKIE_REQUEST_ID_KEY])) {
        proxyReq.setHeader(HEADER_REQUEST_ID, requestId);
      }
    },
    selfHandleResponse: true,
    onProxyRes: (proxyRes, req, res) => {
      if (
        !req.cookies[COOKIE_REQUEST_ID_KEY] &&
        res.hasHeader(HEADER_REQUEST_ID)
      ) {
        res.cookie(COOKIE_REQUEST_ID_KEY, res.getHeader(HEADER_REQUEST_ID));
        res.removeHeader(HEADER_REQUEST_ID);
      }

      proxyRes.pipe(res);
    },
  });
}

export function checkAuthCode(tokenApi: string): RequestHandler {
  return async (req, res) => {
    try {
      const { access_token, refresh_token } = await http.POST<Tokens>(
        tokenApi,
        req.body
      );

      res
        .cookie(COOKIE_ACCESS_TOKEN_KEY, access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .cookie(COOKIE_REFRESH_TOKEN_KEY, refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .sendStatus(204);
    } catch (e) {
      if (e.code && typeof e.response === "object") {
        res.status(e.code).json(e.response);
      } else {
        res.status(500).json({ code: -1, message: "internal server error" });
      }
    }
  };
}

export function refreshToken(refreshApi: string): RequestHandler {
  return async (req, res) => {
    let refreshToken: string;

    if (!(refreshToken = req.cookies(COOKIE_REFRESH_TOKEN_KEY))) {
      res.status(403).json({ code: -1, message: "empty refresh token" });
      return;
    }

    try {
      const { access_token, refresh_token } = await http.POST<Tokens>(
        refreshApi,
        {
          refresh_token: refreshToken,
        }
      );

      res
        .cookie(COOKIE_ACCESS_TOKEN_KEY, access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .cookie(COOKIE_REFRESH_TOKEN_KEY, refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .sendStatus(204);
    } catch (e) {
      if (e.code && typeof e.response === "object") {
        res.status(e.code).json(e.response);
      } else {
        res.status(500).json({ code: -1, message: "internal server error" });
      }
    }
  };
}
