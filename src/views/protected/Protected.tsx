import React, { FC, HTMLProps } from "react";

type ProtectedProps = HTMLProps<HTMLDivElement>;

const Protected: FC<ProtectedProps> = function () {
  return <div>This is a Protected page.</div>;
};

export default Protected;
