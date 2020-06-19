import loadable from "@loadable/component";

import RouteConfig from "./RouteConfig";

const Home = loadable(() =>
  import(/* webpackChunkName: "views" */ "@/views/Home")
);
const Login = loadable(() =>
  import(/* webpackChunkName: "views" */ "@/views/Login")
);
const About = loadable(() =>
  import(/* webpackChunkName: "views" */ "@/views/About")
);
const Protected = loadable(() =>
  import(/* webpackChunkName: "views" */ "@/views/Protected")
);
const NotFound = loadable(() =>
  import(/* webpackChunkName: "common" */ "@/views/NotFound")
);

const routes: RouteConfig[] = [
  {
    path: "/",
    exact: true,
    component: Home,
  },
  {
    path: "/login/:id",
    component: Login,
  },
  {
    path: "/about",
    component: About,
  },
  {
    path: "/protected",
    requiresAuth: true,
    redirectPath: "/login",
    component: Protected,
  },
  {
    path: "*",
    component: NotFound,
  },
];

export default routes;
