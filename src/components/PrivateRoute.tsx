import React, { FC } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
  authenticated: boolean;
  redirectPath: string;
}

const PrivateRoute: FC<PrivateRouteProps> = function ({
  authenticated,
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
        if (authenticated) {
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
