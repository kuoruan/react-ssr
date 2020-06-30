import { RootState } from ".";

export const getUsername = (state: RootState) => state.system.userName;
