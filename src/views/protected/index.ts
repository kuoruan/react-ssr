import loadable from "@loadable/component";

const Protected = loadable(
  () => import(/* webpackChunkName: "views" */ "./Protected")
);

export default Protected;
