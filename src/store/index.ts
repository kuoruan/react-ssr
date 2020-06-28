import { routerMiddleware } from "connected-react-router";
import { History } from "history";
import { applyMiddleware, compose, createStore, Middleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import initRootReducer from "./rootReducer";

export type RootState = ReturnType<typeof initRootReducer>;

export default function initStore(history: History, preloadedState?: any) {
  const rootReducer = initRootReducer(history);

  const middlewares: Middleware[] = [routerMiddleware(history), thunk];

  if (process.env.NODE_ENV !== "production") {
    middlewares.push(createLogger());
  }

  return createStore(
    rootReducer,
    preloadedState,
    compose(applyMiddleware(...middlewares))
  );
}
