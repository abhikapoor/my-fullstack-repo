import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadCurrentUser } from '../store/auth/auth.actions';
import {
  selectCurrentUser,
  selectAuthLoading,
} from '../store/auth/auth.selectors';
import { Observable, of } from 'rxjs';
import { first, filter, switchMap, tap, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const store = inject(Store);
  const router = inject(Router);
  const url = state.url;

  return store.select(selectCurrentUser).pipe(
    first(),
    switchMap((user) => {
      if (user) {
        if (url === '/login') {
          router.navigate(['/home']);
          return of(false);
        }
        return of(true);
      }

      store.dispatch(loadCurrentUser());

      return store.select(selectAuthLoading).pipe(
        filter((loading) => loading === false),
        first(),
        switchMap(() =>
          store.select(selectCurrentUser).pipe(
            first(),
            map((currentUser) => {
              if (!currentUser && url !== '/login') {
                router.navigate(['/login']);
                return false;
              }
              if (currentUser && url === '/login') {
                router.navigate(['/home']);
                return false;
              }
              return true;
            })
          )
        )
      );
    })
  );
};
