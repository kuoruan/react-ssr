import { routerMiddleware } from "connected-react-router";
import { History } from "history";
import { applyMiddleware, compose, createStore, Middleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import initRootReducer from "./rootReducer";

export type RootState = ReturnType<ReturnType<typeof initRootReducer>>;

const composeEnhancers =
  (__isClient__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const initStore = (history: History, preloadedState: any = {}) => {
  const middlewares: Middleware[] = [routerMiddleware(history), thunk];

  if (__isClient__ && process.env.NODE_ENV !== "production") {
    middlewares.push(createLogger());
  }

  return createStore(
    initRootReducer(history),
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

export default initStore;
