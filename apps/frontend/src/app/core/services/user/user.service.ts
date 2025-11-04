import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SafeUser } from '@my-fullstack-repo/shared-prisma-types';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/users';

  getAll(): Observable<SafeUser[]> {
    return this.http.get<SafeUser[]>(this.baseUrl, { withCredentials: true });
  }

  updateUser(id: string, data: Partial<SafeUser>): Observable<SafeUser> {
    return this.http.patch<SafeUser>(`${this.baseUrl}/${id}`, data, {
      withCredentials: true,
    });
  }
}
