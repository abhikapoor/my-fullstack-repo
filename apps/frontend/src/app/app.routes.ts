// import { Routes } from '@angular/router';
// import { LoginComponent } from './features/auth/login.component';
// import { UsersComponent } from './features/users/users.component';
// import { authGuard } from '../app/core/guards/auth.guard';

// export const appRoutes: Routes = [
//   { path: 'login', component: LoginComponent, canActivate: [authGuard] },
//   { path: 'home', component: UsersComponent, canActivate: [authGuard] },
//   { path: '**', redirectTo: 'login' },
// ];

import { Routes } from '@angular/router';
import { authGuard } from '../app/core/guards/auth.guard'; // Assuming this path is correct

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((c) => c.LoginComponent),
    canActivate: [authGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/users/users.component').then((c) => c.UsersComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' },
];
