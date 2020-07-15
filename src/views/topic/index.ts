import loadable from "@loadable/component";

import { RouteConfigProperties } from "@/routes/types";

const component = loadable(() =>
  import(/* webpackChunkName: "views" */ "./Topic")
);

const Topic: typeof component & RouteConfigProperties = component;

Topic.fetchData = function () {
  return Promise.resolve();
};

export default Topic;
