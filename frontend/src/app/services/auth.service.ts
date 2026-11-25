import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'banco_semillas_token';
  private readonly nombreKey = 'banco_semillas_nombre';
  private readonly correoKey = 'banco_semillas_correo';

  login(datos: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, datos).pipe(
      tap((respuesta) => {
        sessionStorage.setItem(this.tokenKey, respuesta.token);
        sessionStorage.setItem(this.nombreKey, respuesta.nombre);
        sessionStorage.setItem(this.correoKey, respuesta.correo);
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getNombre(): string {
    return sessionStorage.getItem(this.nombreKey) ?? 'Administrador';
  }

  getCorreo(): string {
    return sessionStorage.getItem(this.correoKey) ?? '';
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.nombreKey);
    sessionStorage.removeItem(this.correoKey);
  }
}
