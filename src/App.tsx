import "@/assets/scss/tailwind.scss";
import React, { FC, HTMLProps } from "react";
import { Helmet } from "react-helmet";
import { Switch, Route } from "react-router-dom";

import PrivateRoute from "@/components/PrivateRoute";
import routes from "@/routes";

interface AppProps extends HTMLProps<HTMLDivElement> {}

const App: FC<AppProps> = function (props: AppProps) {
  return (
    <>
      <Helmet>
        <title>React.js Server Side Render.</title>
      </Helmet>
      <Switch>
        {routes.map(
          ({ requiresAuth, redirectPath = "/login", ...restProps }, index) => {
            if (requiresAuth) {
              return (
                <PrivateRoute
                  key={index}
                  redirectPath={redirectPath}
                  {...restProps}
                />
              );
            } else {
              return <Route key={index} {...restProps} />;
            }
          }
        )}
      </Switch>
    </>
  );
};

export default App;
