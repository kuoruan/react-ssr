import { RouteConfigProperties } from "@/routes/types";
import { fetchUserInfo } from "@/store/system/thunks";

import component from "./About";

const About: typeof component & RouteConfigProperties = component;

About.fetchData = function ({ store }) {
  return store.dispatch<any>(fetchUserInfo());
};

export default About;
