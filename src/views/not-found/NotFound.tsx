import React, { FC, HTMLProps } from "react";

import Status from "@/components/Status";

type NotFoundProps = HTMLProps<HTMLDivElement>;

const NotFound: FC<NotFoundProps> = function () {
  return (
    <Status statusCode={404}>
      <div>
        <h1>Page not found.</h1>
      </div>
    </Status>
  );
};

export default NotFound;
