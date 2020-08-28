import loadable from "@loadable/component";

const NotFound = loadable(
  () => import(/* webpackChunkName: "views" */ "./NotFound")
);

export default NotFound;
