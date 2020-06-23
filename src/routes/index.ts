import About from "@/views/about";
import Home from "@/views/home";
import Login from "@/views/login";
import NotFound from "@/views/not-found";
import Protected from "@/views/protected";
import Topic from "@/views/topic";

import RouteConfig from "./RouteConfig";

const routes: RouteConfig[] = [
  {
    path: "/",
    exact: true,
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/about",
    component: About,
    routes: [
      {
        path: "/about/:topicId",
        component: Topic,
      },
    ],
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
