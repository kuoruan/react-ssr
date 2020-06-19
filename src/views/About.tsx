import React, { FC, HTMLProps } from "react";
import { useRouteMatch, Link, Switch, Route } from "react-router-dom";

import Topic from "./Topic";

interface AboutProps extends HTMLProps<HTMLDivElement> {}

const About: FC<AboutProps> = function (props: AboutProps) {
  let { path, url } = useRouteMatch();
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
      <Switch>
        <Route exact path={path}>
          <h3>Please select a topic.</h3>
        </Route>
        <Route path={`${path}/:topicId`}>
          <Topic />
        </Route>
      </Switch>
    </div>
  );
};

export default About;
