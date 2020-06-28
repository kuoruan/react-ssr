import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers } from "redux";

import { systemReducer } from "./system/reducers";

export default function initRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    system: systemReducer,
  });
}
