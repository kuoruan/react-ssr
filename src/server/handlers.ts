import fs from "fs";
import url from "url";

import csurf from "csurf";
import { RequestHandler, ErrorRequestHandler } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import {
  CONTENT_TYPE_JSON,
  HEADER_AUTHORIZATION,
  HEADER_CONTENT_LENGTH,
  HEADER_CONTENT_TYPE,
  HEADER_CSRF_TOKEN,
  HEADER_REQUEST_ID,
} from "@/http/types";

import {
  COOKIE_REQUEST_ID_KEY,
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
  Tokens,
  READ_TIMEOUT,
  PROXY_TIMEOUT,
} from "./types";
import { request, extractJWTClaims } from "./utils";

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
    value: (req) => {
      const otken = req.get(HEADER_CSRF_TOKEN) || "";
      return otken;
    },
  });
}

export function csrfErrorHandler(): ErrorRequestHandler {
  return (err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
      res.status(403).json({ code: -1, message: "invalid csrf token" });
      return;
    }

    next(err);
  };
}

export function proxyApi(
  targetHost: string,
  basePath: string,
  proxyPath: string
): RequestHandler {
  return createProxyMiddleware({
    target: targetHost,
    timeout: READ_TIMEOUT,
    proxyTimeout: PROXY_TIMEOUT,
    pathRewrite: (pahtname) => {
      return pahtname.replace(new RegExp(`^${basePath}`), proxyPath);
    },
    onError: (err, req, res) => {
      res.status(500).json({ code: -1, message: "internal server error" });
    },
    onProxyReq: (proxyReq, req) => {
      let token, requestId: string;
      // get the access token from cookie and add it to the request header
      if ((token = req.cookies[COOKIE_ACCESS_TOKEN_KEY])) {
        proxyReq.setHeader(HEADER_AUTHORIZATION, `Bearer ${token}`);
      }

      if ((requestId = req.cookies[COOKIE_REQUEST_ID_KEY])) {
        proxyReq.setHeader(HEADER_REQUEST_ID, requestId);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      let requestId;
      if (
        !req.cookies[COOKIE_REQUEST_ID_KEY] &&
        (requestId = proxyRes.headers["x-request-id"])
      ) {
        res.cookie(COOKIE_REQUEST_ID_KEY, requestId);
      }

      delete proxyRes.headers["x-request-id"];
    },
  });
}

export function checkAuthCode(authApi: string): RequestHandler {
  const u = url.parse(authApi);
  return async (req, res) => {
    const data = JSON.stringify(req.body);

    try {
      const { access_token, refresh_token } = await request<Tokens>(
        {
          method: "POST",
          host: u.hostname,
          path: u.path,
          port: u.port,
          timeout: READ_TIMEOUT,
          headers: {
            ...req.headers,
            [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
            [HEADER_CONTENT_LENGTH]: data.length,
          },
        },
        data
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
      if (e.statusCode) {
        if (typeof e.response === "object") {
          res.status(e.statusCode).json(e.response);
        } else {
          res.status(e.statusCode).json({ code: -1, message: "unknown error" });
        }
      } else {
        res.status(500).json({ code: -1, message: "internal server error" });
      }
    }
  };
}

export function autoRefreshToken(refreshApi: string): RequestHandler {
  const u = url.parse(refreshApi);

  return async (req, res, next) => {
    const now = (Date.now() / 1000) | 0;
    console.log(refreshApi);

    let accessToken, atClaims;
    if (
      (accessToken = req.cookies[COOKIE_ACCESS_TOKEN_KEY]) &&
      (atClaims = extractJWTClaims(accessToken))
    ) {
      let refreshToken, rtClaims;

      if (
        atClaims.exp &&
        atClaims.exp - 60 < now && // access token expired
        (refreshToken = req.cookies[COOKIE_REFRESH_TOKEN_KEY]) &&
        (rtClaims = extractJWTClaims(refreshToken)) &&
        rtClaims.exp &&
        rtClaims.exp - 60 > now
      ) {
        const data = JSON.stringify({ refresh_token: refreshToken });

        try {
          const { access_token, refresh_token } = await request<Tokens>(
            {
              method: "POST",
              host: u.hostname,
              path: u.path,
              port: u.port,
              timeout: READ_TIMEOUT,
              headers: {
                ...req.headers,
                [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
                [HEADER_CONTENT_LENGTH]: data.length,
              },
            },
            data
          );

          req.cookies[COOKIE_ACCESS_TOKEN_KEY] = access_token;
          req.cookies[COOKIE_REFRESH_TOKEN_KEY] = refresh_token;

          res
            .cookie(COOKIE_ACCESS_TOKEN_KEY, access_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            })
            .cookie(COOKIE_REFRESH_TOKEN_KEY, refresh_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            });
        } catch (e) {
          console.log("token refresh failed", e);
        } finally {
          next();
        }
        return;
      }
    }

    next();
  };
}

export function revokeTokens(): RequestHandler {
  return (req, res) => {
    res
      .clearCookie(COOKIE_ACCESS_TOKEN_KEY)
      .clearCookie(COOKIE_REFRESH_TOKEN_KEY)
      .sendStatus(204);
  };
}
