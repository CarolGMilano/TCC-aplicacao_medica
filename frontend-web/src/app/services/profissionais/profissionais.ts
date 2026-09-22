import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments';
import { IProfissionaisResponse, IProfissional, IProfissionalRequest, TipoUsuario } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class ProfissionalService {
  private readonly _httpClient = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/profissionais`;

  httpOptions = {
    observe: "response" as "response",
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  listar(
    pagina: number = 0,
    tamanho: number = 10,
    busca?: string,
    tipo?: TipoUsuario
  ): Observable<IProfissionaisResponse | null> {
    let parametros = `?page=${pagina}&size=${tamanho}`;

    if (busca) {
      parametros += `&busca=${encodeURIComponent(busca)}`;
    }

    if (tipo) {
      parametros += `&tipo=${tipo}`;
    }

    return this._httpClient.get<IProfissionaisResponse>(
      `${this.BASE_URL}${parametros}`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<IProfissionaisResponse>) => resposta.body ?? null),
      catchError((erro) => throwError(() => erro))
    );
  }

  inserir(profissional: IProfissionalRequest): Observable<IProfissionalRequest> {
    return this._httpClient.post<IProfissionalRequest>(
      this.BASE_URL,
      profissional
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  atualizar(idMedico: number, profissional: IProfissionalRequest): Observable<IProfissional> {
    return this._httpClient.put<IProfissional>(
      `${this.BASE_URL}/${idMedico}`,
      profissional
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  deletar(id: number): Observable<void> {
    return this._httpClient.delete<void>(
      `${this.BASE_URL}/${id}`
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }
}