export type Tokens = {
  accessToken?: string;
  csrfToken?: string;
};

export type Client = {
  GET<T>(url: string, options?: RequestInit): Promise<T>;
  POST<T>(url: string, data: object, options?: RequestInit): Promise<T>;
  PUT<T>(url: string, data: object, options?: RequestInit): Promise<T>;
  PATCH<T>(url: string, data: object, options?: RequestInit): Promise<T>;
  DELETE<T>(url: string, data: object, options?: RequestInit): Promise<T>;
};
