import React, { FC } from "react";
import { SwitchProps, Switch, Route } from "react-router-dom";

import RouteConfig from "@/routes/RouteConfig";

import PrivateRoute from "./PrivateRoute";

interface RoutesProps extends SwitchProps {
  routes?: RouteConfig[];
}

const Routes: FC<RoutesProps> = function ({
  routes,
  ...restProps
}: RoutesProps) {
  if (!routes || routes.length <= 0) {
    return null;
  }

  return (
    <Switch {...restProps}>
      {routes.map((route, i) =>
        route.requiresAuth ? (
          <PrivateRoute
            key={i}
            redirectPath={route.redirectPath || "/login"}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={(props) =>
              route.render ? (
                route.render({ ...props, route: route })
              ) : route.component ? (
                <route.component {...props} route={route} />
              ) : null
            }
            sensitive={route.sensitive}
          />
        ) : (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={(props) =>
              route.render ? (
                route.render({ ...props, route: route })
              ) : route.component ? (
                <route.component {...props} route={route} />
              ) : null
            }
            sensitive={route.sensitive}
          ></Route>
        )
      )}
    </Switch>
  );
};

export default Routes;
