import Api from "@/api";
import { Tokens } from "@/api/types";

export default function configureApi(tokens: Tokens): Api {
  const baseURL = __isClient__
    ? "/api"
    : `${process.env.APP_API_PROXY_TARGET}${process.env.APP_API_BASE_SERVER}`;

  return new Api(baseURL, tokens);
}
