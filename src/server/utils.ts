import http, { RequestOptions } from "http";

import Minimist from "minimist";
import PortFinder from "portfinder";

import { UserClaims } from "./types";

export function parseArgs(initValue?: {
  [key: string]: number | boolean | string;
}) {
  return Minimist(process.argv.slice(2), { default: initValue });
}

export function getRunPort(
  commandPort: string,
  defaultPort: number
): Promise<number> {
  let portNumber: number;

  let commandPortNumber, envPortNumber: number;
  if (commandPort && (commandPortNumber = parseInt(commandPort)) > 0) {
    portNumber = commandPortNumber;
  } else if (
    process.env.PORT &&
    (envPortNumber = parseInt(process.env.PORT)) > 0
  ) {
    portNumber = envPortNumber;
  } else {
    portNumber = defaultPort;
  }

  return PortFinder.getPortPromise({ port: portNumber });
}

export function extractJWTClaims(token: string): UserClaims | null {
  let encodedClaims;
  if (!(encodedClaims = token.split(".")[1])) {
    return null;
  }

  encodedClaims = encodedClaims.replace("-", "+").replace("_", "/");

  const buf = Buffer.from(encodedClaims, "base64");

  let obj;
  try {
    obj = JSON.parse(buf.toString("utf-8"));
  } catch {
    obj = null;
  }

  return obj;
}

export function request<T>(options: RequestOptions, data?: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const req = http.request(options, (resp) => {
      const statusCode = resp.statusCode || 0;

      const chunks: Uint8Array[] = [];
      resp.on("data", (chunk) => {
        chunks.push(chunk);
      });

      resp.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf-8");

        let response: any;
        try {
          response = JSON.parse(body);

          if (statusCode < 200 || statusCode > 300) {
            reject({
              statusCode: statusCode,
              response: response,
            });
          } else {
            resolve(response);
          }
        } catch {
          reject({ statusCode: statusCode, rawResponse: body });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}
