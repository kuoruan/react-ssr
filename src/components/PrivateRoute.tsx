import React, { FC } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";

import auth from "@/auth";

interface PrivateRouteProps extends RouteProps {
  redirectPath: string;
}

const PrivateRoute: FC<PrivateRouteProps> = function ({
  redirectPath,
  render,
  children,
  component: Component,
  ...restProps
}: PrivateRouteProps) {
  return (
    <Route
      {...restProps}
      render={(props) => {
        if (auth.isAuthenticated) {
          if (render) {
            return render({ ...props });
          } else if (Component) {
            return <Component {...props} />;
          } else {
            return children;
          }
        } else {
          return (
            <Redirect
              to={{
                pathname: redirectPath,
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
};

export default PrivateRoute;
