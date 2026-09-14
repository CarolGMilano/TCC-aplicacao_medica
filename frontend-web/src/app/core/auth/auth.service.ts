import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  email: string;
  senha: string;
}

interface TokenResponse {
  token: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8081/api/auth';
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
    return this.getToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}
