import { RouterState } from "connected-react-router";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

import { SystemState } from "./system/types";

export type RootState = {
  router: RouterState;
  system: SystemState;
};

export type ThunkResult<R> = ThunkAction<R, RootState, unknown, Action<string>>;
