import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../services/user/user.service';
import * as UsersActions from './user.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { SharedMessageService } from '../../../shared/services/message.service'

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private messageService = inject(SharedMessageService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      mergeMap(() =>
        this.userService.getAll().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((error) => of(UsersActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      mergeMap(({ id, changes }) =>
        this.userService.updateUser(id, changes).pipe(
          map((user) => UsersActions.updateUserSuccess({ user })),
          catchError((error) => of(UsersActions.updateUserFailure({ error })))
        )
      )
    )
  );

  updateUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUserSuccess),
      tap(()=> this.messageService.success('User Updated Successfully'))
    ),
    {dispatch: false}
  );

  updateUserFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUserFailure),
      tap(()=> this.messageService.error('Error while updating the user'))
    ),
    {dispatch: false}
  );
}
