import React, { FC, HTMLProps } from "react";
import { useHistory, useLocation } from "react-router-dom";

import auth from "@/auth";

interface LoginProps extends HTMLProps<HTMLDivElement> {}

const Login: FC<LoginProps> = function (props: LoginProps) {
  const history = useHistory();
  const location = useLocation<{ from: Location }>();

  const { from } = location.state || { from: { pathname: "/" } };

  const login: React.MouseEventHandler = () => {
    auth.authenticate(() => {
      history.replace(from);
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
};

export default Login;
