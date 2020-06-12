import loadable from "@loadable/component";
import React, { FC, HTMLProps } from "react";
import { Helmet } from "react-helmet";
import { Switch, Route } from "react-router-dom";

const About = loadable(() =>
  import(/* webpackChunkName: "views" */ "@/views/About")
);
const Home = loadable(() =>
  import(/* webpackChunkName: "views" */ "@/views/Home")
);
const NotFound = loadable(() =>
  import(/* webpackChunkName: "common" */ "@/views/NotFound")
);

interface AppProps extends HTMLProps<HTMLDivElement> {}

const App: FC<AppProps> = function (props: AppProps) {
  return (
    <>
      <Helmet>
        <title>React.js Server Side Render.</title>
      </Helmet>
      <Switch>
        <Route path="/" component={Home} exact={true} />
        <Route path="/about" component={About} />
        <Route path="*" component={NotFound} />
      </Switch>
    </>
  );
};

export default App;
