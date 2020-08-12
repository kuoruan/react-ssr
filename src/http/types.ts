export const HEADER_CONTENT_TYPE = "Content-Type";
export const HEADER_AUTHORIZATION = "Authorization";
export const HEADER_REQUEST_ID = "X-Request-Id";
export const HEADER_CSRF_TOKEN = "X-CSRF-Token";

export const CONTENT_TYPE_JSON = "application/json";
export const CONTENT_TYPE_STREAM = "application/octet-stream";
export const CONTENT_TYPE_TEXT = "text/plain";

export type ErrorResponse = {
  code: number;
  message: string;
  details?: string[];
};
