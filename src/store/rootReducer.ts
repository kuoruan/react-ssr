import { connectRouter } from "connected-react-router";
import { History } from "history";
import { AnyAction, combineReducers, Reducer } from "redux";

import systemReducer from "./system/reducer";
import { RootState } from "./types";

const initRootReducer = (history: History): Reducer<RootState, AnyAction> => {
  return combineReducers({
    router: connectRouter(history),
    system: systemReducer,
  });
};

export default initRootReducer;
