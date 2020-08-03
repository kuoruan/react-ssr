import HttpError from "./HttpError";
import {
  CONTENT_TYPE_JSON,
  CONTENT_TYPE_TEXT,
  CONTENT_TYPE_STREAM,
  HEADER_CONTENT_TYPE,
} from "./types";

export function requestData<T = any>(
  url = "",
  options?: RequestInit | string,
  body?: object
): Promise<T> {
  if (typeof options === "undefined") {
    options = {
      method: "GET",
      headers: {
        [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
      },
    };
  } else if (typeof options === "string") {
    options = {
      method: options,
      headers: {
        [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
      },
      body: body ? JSON.stringify(body) : undefined,
    };
  } else {
    const headers: HeadersInit = Object.assign(
      {},
      {
        [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
      },
      options.headers ?? {}
    );

    options = Object.assign(
      {},
      {
        method: "GET",
      },
      options,
      {
        headers: headers,
        body: body
          ? JSON.stringify(body)
          : options.body
          ? options.body
          : undefined,
      }
    );
  }

  return fetch(url, options)
    .then((res) => {
      const status = res.status;

      if (status >= 200 && status < 300) {
        return res;
      } else {
        // handle response error
        return res.text().then((text) => {
          let resObj;
          try {
            resObj = JSON.parse(text);
          } catch {
            resObj = text;
          }

          throw new HttpError(
            status,
            typeof resObj !== "string" ? resObj.message : undefined,
            resObj
          );
        });
      }
    })
    .then((res) => {
      let contentType;
      if ((contentType = res.headers.get(HEADER_CONTENT_TYPE))) {
        // handle respose ContentType like 'application/json; charset=utf-8'
        contentType = contentType.split(";").shift() || "";
      }

      switch (contentType) {
        case CONTENT_TYPE_JSON: {
          return res.json();
        }
        case CONTENT_TYPE_TEXT: {
          return res.text();
        }
        case CONTENT_TYPE_STREAM:
        default: {
          return res.blob();
        }
      }
    });
}

export * from "./types";
