export const COOKIE_ACCESS_TOKEN_KEY = "_at";
export const COOKIE_REFRESH_TOKEN_KEY = "_rt";
export const COOKIE_REQUEST_ID_KEY = "_rd";

export type Tokens = {
  user_id: string;
  access_token: string;
  refresh_token: string;
};

export type UserClaims = {
  jtt: number;
  aud?: string;
  exp?: number;
  jti?: string;
  iat?: number;
  iss?: string;
  nbf?: number;
  sub?: string;
};
