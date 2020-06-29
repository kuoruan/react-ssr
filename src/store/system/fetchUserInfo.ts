import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

import { RootState } from "../index";
import { updateSession } from "./actions";

function fetchUserInfo(): ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  Action
> {
  return (dispatch) => {
    return new Promise<void>(function (resolve) {
      setTimeout(function () {
        dispatch(
          updateSession({ loggedIn: true, session: "", userName: "AAA" })
        );
        resolve();
      }, 1000);
    });
  };
}

export default fetchUserInfo;
