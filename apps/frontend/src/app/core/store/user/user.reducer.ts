import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './user.actions';
import { SafeUser } from '@my-fullstack-repo/shared-prisma-types';

export interface UsersState {
  users: SafeUser[];
  loading: boolean;
  error: any;
}

export const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialState,

  // Load users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update user
  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    loading: false,
  })),
  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
