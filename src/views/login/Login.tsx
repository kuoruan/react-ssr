import React, { FC, HTMLProps } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { fetchUserInfo } from "@/store/system/thunks";

interface LoginProps extends HTMLProps<HTMLDivElement> {}

const Login: FC<LoginProps> = function (props: LoginProps) {
  const location = useLocation<{ from: Location }>();

  const dispath = useDispatch();

  const { from } = location.state || { from: { pathname: "/" } };

  const login: React.MouseEventHandler = () => {
    dispath(fetchUserInfo());
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
};

export default Login;
