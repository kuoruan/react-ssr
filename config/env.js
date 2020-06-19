const fs = require("fs");
const path = require("path");

const DotEnv = require("dotenv");

const { rootPath } = require("./conf");

if (!process.env.NODE_ENV) {
  throw new Error(
    "The process.env.NODE_ENV environment variable is required but was not specified."
  );
}

const runMode = process.env.MODE || process.env.NODE_ENV;

const dotEnvFile = path.resolve(rootPath, ".env");

const dotEnvFiles = [
  `${dotEnvFile}.${runMode}.local`,
  `${dotEnvFile}.${runMode}`,
  `${dotEnvFile}.local`,
  dotEnvFile,
];

for (const file of dotEnvFiles) {
  if (fs.existsSync(file)) {
    DotEnv.config({
      path: file,
    });
  }
}

const raw = Object.keys(process.env)
  .filter((key) => /^APP_/i.test(key))
  .reduce(
    (env, key) => {
      env[key] = process.env[key];
      return env;
    },
    {
      NODE_ENV: process.env.NODE_ENV,
      PACKAGE_BUILD_TIME: new Date().toLocaleString(),
    }
  );

const stringified = {
  "process.env": Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(raw[key]);
    return env;
  }, {}),
};

module.exports = { raw, stringified };
