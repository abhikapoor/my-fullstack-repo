import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { UsersComponent } from './features/users/users.component';
import { authGuard } from '../app/core/guards/auth.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'home', component: UsersComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
