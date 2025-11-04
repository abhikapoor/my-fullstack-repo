import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';

import { appRoutes } from './app.routes';
import { authReducer } from './core/store/auth/auth.reducer';
import { AuthEffects } from './core/store/auth/auth.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { usersReducer } from './core/store/user/user.reducer';
import { UsersEffects } from './core/store/user/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ auth: authReducer, users: usersReducer }),
    provideEffects([AuthEffects, UsersEffects]),
    provideAnimations(),
    importProvidersFrom(ToastModule),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
