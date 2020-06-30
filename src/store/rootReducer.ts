import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers } from "redux";

import systemReducer from "./system/reducer";

const initRootReducer = (history: History) => {
  return combineReducers({
    router: connectRouter(history),
    system: systemReducer,
  });
};

export default initRootReducer;
