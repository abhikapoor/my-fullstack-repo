import { Component, signal, inject, computed } from '@angular/core';
import { EditUserDialogComponent } from '../../features/users/edit-user-dialog.component';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectCurrentUser } from '../../core/store/auth/auth.selectors';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { logout } from '../../core/store/auth/auth.actions';
import { Role , SafeUser } from '@my-fullstack-repo/shared-prisma-types';
import * as AuthActions from '../../core/store/auth/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [EditUserDialogComponent, AvatarModule, ButtonModule],
})
export class HeaderComponent {
  private store = inject(Store);
  adminIcon = 'assets/admin.ico';
  userIcon = 'assets/user.ico';

  isAdmin = computed(() => this.currentUser()?.role === Role.ADMIN);

  currentUser = toSignal(this.store.select(selectCurrentUser), {
    initialValue: null,
  });
  editDialogVisible = signal(false);

  openEditDialog() {
    this.editDialogVisible.set(true);
  }

  signOut() {
    this.store.dispatch(logout());
  }

  saveUser(updatedUser: SafeUser) {
    this.store.dispatch(
      AuthActions.updateCurrentUser({ id: updatedUser.id, changes: updatedUser })
    );
    this.cancelEdit();
  }

  cancelEdit() {
    this.editDialogVisible.set(false)
  }
}
