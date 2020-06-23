import React, { FC, HTMLProps } from "react";
import { useRouteMatch, Link } from "react-router-dom";

import RoutesSwitch from "@/components/RoutesSwitch";
import { RouteConfigComponentProps } from "@/routes/RouteConfig";

interface AboutProps
  extends HTMLProps<HTMLDivElement>,
    RouteConfigComponentProps {}

const About: FC<AboutProps> = function ({ route }: AboutProps) {
  let { url } = useRouteMatch();
  return (
    <div>
      <h2>This is About page.</h2>
      <ul>
        <li>
          <Link to={`${url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>
      <RoutesSwitch routes={route?.routes} />
    </div>
  );
};

export default About;
