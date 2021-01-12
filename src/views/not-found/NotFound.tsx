import React, { FC, HTMLProps } from "react";

import Status from "@/components/Status";

type NotFoundProps = HTMLProps<HTMLDivElement>;

const NotFound: FC<NotFoundProps> = function (props: NotFoundProps) {
  return (
    <Status statusCode={404}>
      <div {...props}>
        <h1>Page not found.</h1>
      </div>
    </Status>
  );
};

export default NotFound;
