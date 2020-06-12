import React, { FC, HTMLProps } from "react";

interface AboutProps extends HTMLProps<HTMLDivElement> {}

const About: FC<AboutProps> = function (props: AboutProps) {
  return <div>This is About page.</div>;
};

export default About;
