import { request } from "@/http";
import { HEADER_CSRF_TOKEN, HEADER_AUTHORIZATION } from "@/http/types";

import { ApiOptions } from "./types";
import UserApi from "./User";

export default class Api {
  public user: UserApi;

  private baseHeaders: { [key: string]: string };

  private preRequest?: (path: string) => Promise<void> | null;

  private requestWait?: Promise<void> | null;

  constructor(protected baseURL: string, protected options: ApiOptions) {
    const headers: { [key: string]: string } = {};

    if (options.accessToken) {
      headers[HEADER_AUTHORIZATION] = `Bearer ${options.accessToken}`;
    }
    if (options.csrfToken) {
      headers[HEADER_CSRF_TOKEN] = options.csrfToken;
    }

    this.baseHeaders = headers;

    this.preRequest = options.preRequest;

    this.user = new UserApi(this);
  }

  public GET<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = Object.assign({}, this.baseHeaders, options.headers);

    return this.checkAndRequest(
      path,
      Object.assign({}, options, { method: "GET", headers: headers })
    );
  }

  public POST<T = any>(
    path: string,
    data: object,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = Object.assign({}, this.baseHeaders, options.headers);

    return this.checkAndRequest(
      path,
      Object.assign({}, options, { method: "POST", headers: headers }),
      data
    );
  }

  public PATCH<T = any>(
    path: string,
    data: object,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = Object.assign({}, this.baseHeaders, options.headers);

    return this.checkAndRequest(
      path,
      Object.assign({}, options, { method: "PATCH", headers: headers }),
      data
    );
  }

  public PUT<T = any>(
    path: string,
    data: object,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = Object.assign({}, this.baseHeaders, options.headers);

    return this.checkAndRequest(
      path,
      Object.assign({}, options, { method: "PUT", headers: headers }),
      data
    );
  }

  public DELETE<T = any>(
    path: string,
    data: object,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = Object.assign({}, this.baseHeaders, options.headers);

    return this.checkAndRequest(
      path,
      Object.assign({}, options, { method: "DELETE", headers: headers }),
      data
    );
  }

  private async checkAndRequest<T>(
    path = "",
    options?: RequestInit | string,
    body?: object
  ): Promise<T> {
    if (this.requestWait) {
      try {
        await this.requestWait;
      } finally {
        this.requestWait = null;
      }
    } else {
      if (this.preRequest && (this.requestWait = this.preRequest(path))) {
        try {
          await this.requestWait;
        } finally {
          this.requestWait = null;
        }
      }
    }

    return request<T>(`${this.baseURL}/${path}`, options, body);
  }
}
