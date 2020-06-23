import "@/assets/scss/tailwind.scss";
import React, { FC, HTMLProps } from "react";
import { Helmet } from "react-helmet";

import RoutesSwitch from "@/components/RoutesSwitch";
import routes from "@/routes";

interface AppProps extends HTMLProps<HTMLDivElement> {}

const App: FC<AppProps> = function (props: AppProps) {
  return (
    <>
      <Helmet>
        <title>React.js Server Side Render.</title>
      </Helmet>
      <RoutesSwitch routes={routes} />
    </>
  );
};

export default App;
