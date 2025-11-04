import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SafeUser, Role } from '@my-fullstack-repo/shared-prisma-types';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { toSignal } from '@angular/core/rxjs-interop';
import * as UsersActions from '../../core/store/user/user.actions';
import { selectAllUsers } from '../../core/store/user/user.selectors';
import { FormBuilder } from '@angular/forms';
import { EditUserDialogComponent } from './edit-user-dialog.component';
import { DatePipe } from '@angular/common';
import { selectCurrentUser } from '../../core/store/auth/auth.selectors';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  imports: [
    TableModule,
    ButtonModule,
    CardModule,
    EditUserDialogComponent,
    DatePipe,
  ],
})
export class UsersComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  users = toSignal(this.store.select(selectAllUsers), { initialValue: [] });
  me = toSignal(this.store.select(selectCurrentUser));
  isAdmin = computed(() => this.me()?.role === Role.ADMIN);

  editDialogVisible = false;
  selectedUser: SafeUser | null = null;

  constructor() {
    this.store.dispatch(UsersActions.loadUsers());
  }

  openEditDialog(user: SafeUser) {
    this.selectedUser = user;
    this.editDialogVisible = true;
  }

  saveUser(updatedUser: SafeUser) {
    this.store.dispatch(
      UsersActions.updateUser({ id: updatedUser.id, changes: updatedUser })
    );
    this.cancelEdit();
  }

  cancelEdit() {
    this.editDialogVisible = false;
    this.selectedUser = null;
  }
}
