import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

import initRootReducer from "./rootReducer";

export type RootState = ReturnType<ReturnType<typeof initRootReducer>>;

export type ThunkResult<R> = ThunkAction<R, RootState, unknown, Action<string>>;
