import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginSuccess,
  loginFailure,
  loadCurrentUser,
  loadCurrentUserSuccess,
  loadCurrentUserFailure,
  logoutSuccess,
  updateCurrentUserFailure,
} from './auth.actions';
import { SafeUser } from '@my-fullstack-repo/shared-prisma-types';

export interface AuthState {
  user: SafeUser | null;
  loading: boolean;
  error: any;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(login, loadCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loginSuccess, loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),

  on(loginFailure, loadCurrentUserFailure, updateCurrentUserFailure ,(state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(logoutSuccess, () => initialState)
);
