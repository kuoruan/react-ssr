export type ApiOptions = {
  accessToken?: string;
  csrfToken?: string;
  preRequest?: (path: string) => Promise<void> | null;
};

export type Client = {
  GET<T>(url: string, options?: RequestInit): Promise<T>;
  POST<T>(url: string, data: object, options?: RequestInit): Promise<T>;
  PUT<T>(url: string, data: object, options?: RequestInit): Promise<T>;
  PATCH<T>(url: string, data: object, options?: RequestInit): Promise<T>;
  DELETE<T>(url: string, data: object, options?: RequestInit): Promise<T>;
};
