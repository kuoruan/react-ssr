import Api from "@/api";
import { ApiOptions } from "@/api/types";

export default function configureApi(options: ApiOptions): Api {
  const baseURL = __isClient__
    ? "/api"
    : `${process.env.APP_API_HOST}${process.env.APP_API_BASE_PATH}`;

  return new Api(baseURL, options);
}
