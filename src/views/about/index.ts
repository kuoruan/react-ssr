import loadable from "@loadable/component";

import { RouteConfigProperties } from "@/routes/types";

const component = loadable(() =>
  import(/* webpackChunkName: "views" */ "./About")
);

const About: typeof component & RouteConfigProperties = component;

About.serverFetch = function () {
  return Promise.resolve();
};

export default About;
