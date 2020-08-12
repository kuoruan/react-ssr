export const HEADER_CONTENT_TYPE = "Content-Type";

export const CONTENT_TYPE_JSON = "application/json";

export const CONTENT_TYPE_STREAM = "application/octet-stream";

export const CONTENT_TYPE_TEXT = "text/plain";

export type ErrorResponse = {
  code: number;
  message: string;
  details?: string[];
};
