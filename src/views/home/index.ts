import loadable from "@loadable/component";

const Home = loadable(() => import(/* webpackChunkName: "views" */ "./Home"));

// https://github.com/gregberge/loadable-components/issues/259
export default Home;
