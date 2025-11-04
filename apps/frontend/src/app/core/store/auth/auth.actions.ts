import { createAction, props } from '@ngrx/store';
import { SafeUser } from '@my-fullstack-repo/shared-prisma-types';

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: SafeUser }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

// Load Current User
export const loadCurrentUser = createAction('[Auth] Load Current User');
export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: SafeUser }>()
);
export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure',
  props<{ error: any }>()
);

// Logout
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');


export const updateCurrentUser = createAction(
  '[Auth] Update Current user',
  props<{ id: string; changes: Partial<SafeUser> }>()
);

export const updateCurrentUserSuccess = createAction(
  '[Auth] Update Current user Success',
  props<{ user: SafeUser }>()
);

export const updateCurrentUserFailure = createAction(
  '[Auth] Update Current user Failure',
  props<{ error: any }>()
);
