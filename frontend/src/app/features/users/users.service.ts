import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { User } from "./users.model";

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

// Toda regra de negócio de CRUD passa pela API Express — nunca pelo
// PostgREST/supabase-js diretamente (seção 8 e anti-padrões, item 13).
@Injectable({ providedIn: "root" })
export class UsersService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  list(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: Pick<User, "name" | "email">): Observable<User> {
    return this.http.post<ApiResponse<User>>(this.baseUrl, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: Partial<Pick<User, "name" | "email">>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/${id}`, payload).pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
