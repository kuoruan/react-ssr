import React, { FC, HTMLProps } from "react";

interface ProtectedProps extends HTMLProps<HTMLDivElement> {}

const Protected: FC<ProtectedProps> = function (props: ProtectedProps) {
  return <div>This is a Protected page.</div>;
};

export default Protected;
