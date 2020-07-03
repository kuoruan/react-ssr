import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Route, RouteProps, Redirect } from "react-router-dom";

import { isLoggedIn } from "@/store/selectors";

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
  const loggedIn = useSelector(isLoggedIn);

  return (
    <Route
      {...restProps}
      render={(props) => {
        if (loggedIn) {
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
