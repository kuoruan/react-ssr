export const UPDATE_SESSION = "UPDATE_SESSION";

export interface SystemState {
  loggedIn: boolean;
  csrf: string;
  userName: string;
}

interface UpdateSessionAction {
  type: typeof UPDATE_SESSION;
  payload: Pick<SystemState, "loggedIn" | "userName">;
}

export type SystemActionTypes = UpdateSessionAction;
