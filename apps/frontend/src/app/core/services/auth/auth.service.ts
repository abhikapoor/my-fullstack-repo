import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SafeUser } from '@my-fullstack-repo/shared-prisma-types';
import { ConfigService } from '../config/config.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private config = inject(ConfigService);
  private baseUrl = this.config.getConfig().apiBaseUrl;
  private http = inject(HttpClient);

  login(credentials: {
    email: string;
    password: string;
  }): Observable<SafeUser> {
    return this.http.post<SafeUser>(`${this.baseUrl}/auth/login`, credentials, {
      withCredentials: true,
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  me(): Observable<SafeUser> {
    return this.http.get<SafeUser>(`${this.baseUrl}/users/me`, {
      withCredentials: true,
    });
  }
}
