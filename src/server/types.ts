import Express from "express";

export const COOKIE_ACCESS_TOKEN_KEY = "_access_token";
export const COOKIE_REFRESH_TOKEN_KEY = "_refresh_token";

export type ServeMiddleware = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => void;
