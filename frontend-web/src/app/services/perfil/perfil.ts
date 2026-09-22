import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments';
import { IAlterarSenhaRequest, IProfissional } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private readonly _httpClient = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl;

  buscar(): Observable<IProfissional> {
    return this._httpClient.get<IProfissional>(
      `${this.BASE_URL}/perfil`
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  atualizarNome(nome: string): Observable<IProfissional> {
    return this._httpClient.put<IProfissional>(
      `${this.BASE_URL}/perfil/nome`,
      { nome }
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  alterarSenha(dados: IAlterarSenhaRequest): Observable<void> {
    return this._httpClient.put<void>(
      `${this.BASE_URL}/auth/alterar-senha`,
      dados
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }
}