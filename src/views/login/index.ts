import loadable from "@loadable/component";

const Login = loadable(() => import(/* webpackChunkName: "views" */ "./Login"));

export default Login;
