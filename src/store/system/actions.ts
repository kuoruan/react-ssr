import { SystemState, UPDATE_SESSION, SystemActionTypes } from "./types";

export function updateSession(
  newSession: Pick<SystemState, "loggedIn" | "userName">
): SystemActionTypes {
  return {
    type: UPDATE_SESSION,
    payload: newSession,
  };
}
