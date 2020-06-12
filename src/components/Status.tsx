import React, { FC, ReactNode } from "react";
import { Route } from "react-router-dom";

interface StatusProps {
  statusCode: number;
  children: ReactNode;
}

const Status: FC<StatusProps> = function ({
  statusCode,
  children,
}: StatusProps) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.statusCode = statusCode;

          return children;
        }
      }}
    />
  );
};

export default Status;
