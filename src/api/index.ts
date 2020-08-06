import { request } from "@/http";

import { Tokens } from "./types";
import UserApi from "./User";

export default class Api {
  public user: UserApi;

  private baseHeaders: { [key: string]: string };

  constructor(protected baseURL: string, protected tokens: Tokens) {
    const headers: { [key: string]: string } = {};

    if (tokens.accessToken) {
      headers["Authorization"] = `Bearer ${tokens.accessToken}`;
    }
    if (tokens.csrfToken) {
      headers["X-CSRF-Token"] = tokens.csrfToken;
    }

    this.baseHeaders = headers;

    this.user = new UserApi(this);
  }

  public GET<T = any>(url: string, options: RequestInit = {}): Promise<T> {
    const headers = Object.assign({}, this.baseHeaders, options.headers);

    return request<T>(
      `${this.baseURL}/${url}`,
      Object.assign({}, options, { method: "GET", headers: headers })
    );
  }

  public POST<T = any>(
    url: string,
    data: object,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = Object.assign({}, this.baseHeaders, options.headers);

    return request<T>(
      `${this.baseURL}/${url}`,
      Object.assign({}, options, { method: "POST", headers: headers }),
      data
    );
  }

  public PATCH<T = any>(
    url: string,
    data: object,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = Object.assign({}, this.baseHeaders, options.headers);

    return request<T>(
      `${this.baseURL}/${url}`,
      Object.assign({}, options, { method: "PATCH", headers: headers }),
      data
    );
  }

  public PUT<T = any>(
    url: string,
    data: object,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = Object.assign({}, this.baseHeaders, options.headers);

    return request<T>(
      `${this.baseURL}/${url}`,
      Object.assign({}, options, { method: "PUT", headers: headers }),
      data
    );
  }

  public DELETE<T = any>(
    url: string,
    data: object,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = Object.assign({}, this.baseHeaders, options.headers);

    return request<T>(
      `${this.baseURL}/${url}`,
      Object.assign({}, options, { method: "DELETE", headers: headers }),
      data
    );
  }
}
