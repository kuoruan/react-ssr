import loadable from "@loadable/component";

import { RouteConfigProperties } from "@/routes/types";
import { fetchUserInfo } from "@/store/system/thunks";

const component = loadable(
  () => import(/* webpackChunkName: "views" */ "./About")
);

const About: typeof component & RouteConfigProperties = component;

About.fetchData = function ({ store }) {
  return store.dispatch<any>(fetchUserInfo());
};

export default About;
