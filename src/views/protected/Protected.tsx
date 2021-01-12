import React, { FC, HTMLProps } from "react";

type ProtectedProps = HTMLProps<HTMLDivElement>;

const Protected: FC<ProtectedProps> = function (props: ProtectedProps) {
  return <div {...props}>This is a Protected page.</div>;
};

export default Protected;
