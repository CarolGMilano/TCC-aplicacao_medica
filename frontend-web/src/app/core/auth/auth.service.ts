import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TipoUsuario } from '../../shared/models/EnumTipoUsuario';

interface LoginRequest {
  email: string;
  senha: string;
}

interface TokenResponse {
  token: string;
  tipo: string;
}

interface JwtPayload {
  exp?: number;
  tipo?: TipoUsuario;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'cervicare_token';

  login(dados: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, dados).pipe(
      tap((resposta) => {
        sessionStorage.setItem(this.tokenKey, resposta.token);
      }),
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  estaAutenticado(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = jwtDecode<JwtPayload>(token);

      if (!payload.exp || payload.exp * 1000 <= Date.now()) {
        this.logout();
        return false;
      }

      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  getTipoUsuario(): TipoUsuario | null {
    if (!this.estaAutenticado()) return null;
    const tipo = jwtDecode<JwtPayload>(this.getToken()!).tipo;
    return Object.values(TipoUsuario).includes(tipo as TipoUsuario) ? tipo! : null;
  }

  possuiAlgumaRole(roles: readonly TipoUsuario[]): boolean {
    const tipo = this.getTipoUsuario();
    return tipo !== null && roles.includes(tipo);
  }
}
