import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { SharedMessageService } from '../../../shared/services/message.service'
import { Router } from '@angular/router';
import {
  login,
  loginSuccess,
  loginFailure,
  loadCurrentUser,
  loadCurrentUserSuccess,
  loadCurrentUserFailure,
  logout,
  logoutSuccess,
  updateCurrentUser,
  updateCurrentUserFailure,
  updateCurrentUserSuccess
} from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private messageService = inject(SharedMessageService)
  private router = inject(Router);

  // 1️⃣ Login API call
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          tap(()=> this.messageService.success('Login Successfull')),
          map((user) => loginSuccess({ user })),
          catchError((error) => of(loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      map(() => loadCurrentUser())
    )
  );

  loginFailure$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loginFailure),
    tap(() => this.messageService.error('Login Failed : Invalid Credentials'))
  ),
  { dispatch: false }
);

  loadCurrentUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadCurrentUserSuccess),
        tap(() => this.router.navigate(['/home']))
      ),
    { dispatch: false }
  );

  loadCurrentUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadCurrentUserFailure),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentUser),
      mergeMap(() =>
        this.authService.me().pipe(
          map((user) => loadCurrentUserSuccess({ user })),
          catchError((error) => of(loadCurrentUserFailure({ error })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => logoutSuccess()),
          catchError(() => of(logoutSuccess()))
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccess),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );

  updateCurrentUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(updateCurrentUser),
    mergeMap(({ id, changes }) =>
      this.userService.updateUser(id, changes).pipe(
        map((user) => updateCurrentUserSuccess({ user })),
        catchError((error) => of(updateCurrentUserFailure({ error })))
      )
    )
  )
);

updateCurrentUserSuccess$ = createEffect(() =>
  this.actions$.pipe(
    ofType(updateCurrentUserSuccess),
    tap(()=> this.messageService.success('Prifile Updated Successfully')),
    map(() => loadCurrentUser())
  )
);
}
