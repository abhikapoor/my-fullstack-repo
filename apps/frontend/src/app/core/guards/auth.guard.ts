import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadCurrentUser } from '../store/auth/auth.actions';
import {
  selectCurrentUser,
  selectAuthLoading,
} from '../store/auth/auth.selectors';
import { of } from 'rxjs';
import { first, filter, switchMap, map } from 'rxjs/operators';

let hasLoadedUser = false;

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const url = state.url;

  return store.select(selectCurrentUser).pipe(
    first(),
    switchMap((user) => {
      if (user) {
        if (url === '/login') {
          router.navigateByUrl('/home');
          return of(false);
        }
        return of(true);
      }

      if (!hasLoadedUser) {
        hasLoadedUser = true;
        store.dispatch(loadCurrentUser());
      }

      return store.select(selectAuthLoading).pipe(
        filter((loading) => loading === false),
        first(),
        switchMap(() =>
          store.select(selectCurrentUser).pipe(
            first(),
            map((currentUser) => {
              if (currentUser) {
                if (url === '/login') {
                  router.navigateByUrl('/home');
                  return false;
                }
                return true;
              }

              if (url === '/login') {
                return true;
              }

              router.navigateByUrl('/login');
              return false;
            })
          )
        )
      );
    })
  );
};
