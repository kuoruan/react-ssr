import React, { FC } from "react";
import { SwitchProps, Switch, Route } from "react-router-dom";

import { RouteConfig } from "@/routes/types";

import PrivateRoute from "./PrivateRoute";

interface RoutesSwitchProps extends SwitchProps {
  routes?: RouteConfig[];
}

const RoutesSwitch: FC<RoutesSwitchProps> = function ({
  routes,
  ...restProps
}: RoutesSwitchProps) {
  if (!routes || routes.length <= 0) {
    return null;
  }

  return (
    <Switch {...restProps}>
      {routes.map((route, i) =>
        route.requiresAuth ? (
          <PrivateRoute
            key={i}
            redirectPath={route.redirectPath ?? "/login"}
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

export default RoutesSwitch;
