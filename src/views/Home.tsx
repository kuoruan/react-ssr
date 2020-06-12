import React, { FC, HTMLProps, useState } from "react";
import { Helmet } from "react-helmet";

interface HomeProps extends HTMLProps<HTMLDivElement> {}

const Home: FC<HomeProps> = function (props: HomeProps) {
  const [inp, setInp] = useState<string>("");

  return (
    <>
      <Helmet>
        <title>Home page.</title>
      </Helmet>
      <div>
        <p>Hello World.</p>
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
