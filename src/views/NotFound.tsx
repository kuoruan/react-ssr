import React, { FC } from "react";

import Status from "@/components/Status";

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = function (props: NotFoundProps) {
  return (
    <Status statusCode={404}>
      <div>
        <h1>Page not found.</h1>
      </div>
    </Status>
  );
};

export default NotFound;
