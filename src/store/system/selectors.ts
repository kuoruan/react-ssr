import { RootState } from "../types";

export const getUsername = (state: RootState): string => state.system.userName;

export const isLoggedIn = (state: RootState): boolean => state.system.loggedIn;

export const getCSRFToken = (state: RootState): string => state.system.csrf;
