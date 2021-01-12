import { routerMiddleware } from "connected-react-router";
import { History } from "history";
import {
  AnyAction,
  applyMiddleware,
  compose,
  createStore,
  Middleware,
  Store,
} from "redux";
import thunk from "redux-thunk";

import Api from "@/api";

import initRootReducer from "./rootReducer";
import { RootState } from "./types";

const composeEnhancers =
  (__isClient__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const initStore = (
  history: History,
  api: Api,
  preloadedState: any = {}
): Store<RootState, AnyAction> => {
  const middlewares: Middleware[] = [
    routerMiddleware(history),
    thunk.withExtraArgument(api),
  ];

  if (__isClient__ && process.env.NODE_ENV !== "production") {
    const { createLogger } = require("redux-logger");
    middlewares.push(createLogger());
  }

  return createStore(
    initRootReducer(history),
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

export default initStore;
