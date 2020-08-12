import Express from "express";

export const COOKIE_ACCESS_TOKEN_KEY = "_at";
export const COOKIE_REFRESH_TOKEN_KEY = "_rt";
export const COOKIE_REQUEST_ID_KEY = "_rd";

export const HEADER_AUTHORIZATION = "Authorization";
export const HEADER_REQUEST_ID = "X-Request-Id";

export type ServeMiddleware = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => void;

export type Tokens = {
  user_id: string;
  access_token: string;
  refresh_token: string;
};
