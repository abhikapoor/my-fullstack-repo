import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectCurrentUser = createSelector(selectAuthState, (s) => s.user);
export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (s) => !!s.user
);
export const selectAuthError = createSelector(selectAuthState, (s) => s.error);
export const selectAuthLoading = createSelector(
  selectAuthState,
  (s) => s.loading
);
