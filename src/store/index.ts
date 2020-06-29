import { routerMiddleware } from "connected-react-router";
import { History } from "history";
import { applyMiddleware, compose, createStore, Middleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import initRootReducer from "./rootReducer";

export type RootState = ReturnType<typeof initRootReducer>;

export default function initStore(history: History, preloadedState: any = {}) {
  const middlewares: Middleware[] = [routerMiddleware(history), thunk];

  if (__isClient__ && process.env.NODE_ENV !== "production") {
    middlewares.push(createLogger());
  }

  return createStore(
    initRootReducer(history),
    preloadedState,
    compose(applyMiddleware(...middlewares))
  );
}
