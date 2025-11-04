import { createAction, props } from '@ngrx/store';
import { SafeUser } from '@my-fullstack-repo/shared-prisma-types';

// Load all users
export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: SafeUser[] }>()
);
export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: any }>()
);

// Update user
export const updateUser = createAction(
  '[Users] Update User',
  props<{ id: string; changes: Partial<SafeUser> }>()
);
export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{ user: SafeUser }>()
);
export const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{ error: any }>()
);
