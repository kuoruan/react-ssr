import React, { FC, HTMLProps } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, Link } from "react-router-dom";

import RoutesSwitch from "@/components/RoutesSwitch";
import { RouteConfigComponentProps } from "@/routes/types";
import { getUsername } from "@/store/selectors";

interface AboutProps
  extends HTMLProps<HTMLDivElement>,
    RouteConfigComponentProps {}

const About: FC<AboutProps> = function ({ route }: AboutProps) {
  let { url } = useRouteMatch();

  const userName = useSelector(getUsername);

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

      <p>{userName}</p>
    </div>
  );
};

export default About;
