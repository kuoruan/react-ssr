import { ThunkResult } from "../types";
import { updateSession } from "./actions";

export function fetchUserInfo(): ThunkResult<Promise<void>> {
  return (dispatch) => {
    return new Promise<void>(function (resolve) {
      setTimeout(function () {
        dispatch(updateSession({ loggedIn: true, userName: "AAA" }));
        resolve();
      }, 1000);
    });
  };
}
