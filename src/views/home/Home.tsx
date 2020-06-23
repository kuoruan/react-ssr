import React, { FC, HTMLProps, useState } from "react";
import { Helmet } from "react-helmet";

import "./Home.scss";

interface HomeProps extends HTMLProps<HTMLDivElement> {}

const Home: FC<HomeProps> = function (props: HomeProps) {
  const [inp, setInp] = useState<string>("");

  return (
    <>
      <Helmet>
        <title>Home page.</title>
      </Helmet>
      <div className="main">
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
    </>
  );
};

export default Home;
