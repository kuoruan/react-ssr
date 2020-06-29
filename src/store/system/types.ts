export const UPDATE_SESSION = "UPDATE_SESSION";

export interface SystemState {
  loggedIn: boolean;
  session: string;
  userName: string;
}

interface UpdateSessionAction {
  type: typeof UPDATE_SESSION;
  payload: SystemState;
}

export type SystemActionTypes = UpdateSessionAction;
