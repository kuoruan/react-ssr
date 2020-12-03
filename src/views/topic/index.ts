import { RouteConfigProperties } from "@/routes/types";

import component from "./Topic";

const Topic: typeof component & RouteConfigProperties = component;

Topic.fetchData = function () {
  return Promise.resolve();
};

export default Topic;
