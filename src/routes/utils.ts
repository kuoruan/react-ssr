import { matchPath } from "react-router";

import RouteConfig, { MatchedRoute } from "./RouteConfig";

export function matchRoutes<Params extends { [K in keyof Params]?: string }>(
  routes: RouteConfig[],
  pathname: string,
  branch: MatchedRoute<Params>[] = []
): MatchedRoute<Params>[] {
  routes.some((route) => {
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length > 0
      ? branch[branch.length - 1].match // use parent match
      : {
          path: "/",
          url: "/",
          params: Object.create(null),
          isExact: pathname === "/",
        }; // use default "root" match

    if (match) {
      branch.push({ route, match });

      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }

    return match;
  });

  return branch;
}
