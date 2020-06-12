import React, { FC } from "react";
import { Route, Redirect } from "react-router-dom";

interface RedirectWithStatusProps {
  statusCode?: 301 | 302;
  from?: string;
  to: string;
}

const RedirectWithStatus: FC<RedirectWithStatusProps> = function ({
  statusCode = 302,
  from,
  to,
}: RedirectWithStatusProps) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.statusCode = statusCode;
        }

        return <Redirect from={from} to={to} />;
      }}
    />
  );
};

export default RedirectWithStatus;
