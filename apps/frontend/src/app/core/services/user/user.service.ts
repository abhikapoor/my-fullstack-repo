import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SafeUser } from '@my-fullstack-repo/shared-prisma-types';
import { ConfigService } from '../config/config.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private baseUrl = this.config.getConfig().apiBaseUrl;
  getAll(): Observable<SafeUser[]> {
    return this.http.get<SafeUser[]>(`${this.baseUrl}/users`, {
      withCredentials: true,
    });
  }

  updateUser(id: string, data: Partial<SafeUser>): Observable<SafeUser> {
    return this.http.patch<SafeUser>(`${this.baseUrl}/users/${id}`, data, {
      withCredentials: true,
    });
  }
}
