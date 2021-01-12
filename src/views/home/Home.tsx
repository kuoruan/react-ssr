import "./Home.scss";

import React, { FC, HTMLProps, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useRouteMatch } from "react-router-dom";

type HomeProps = HTMLProps<HTMLDivElement>;

const Home: FC<HomeProps> = function (props: HomeProps) {
  const [inp, setInp] = useState<string>("");
  const { url } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Home page.</title>
      </Helmet>
      <div className="main" {...props}>
        <p className="hello">Hello World.</p>
        <input
          type="text"
          value={inp}
          onChange={(e) => {
            setInp(e.target.value);
          }}
        />
        <p>Input value: {inp}</p>
      </div>
      <ul>
        <li>
          <Link to={`${url}about`}>About</Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
