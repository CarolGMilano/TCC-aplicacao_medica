import { inject, Injectable } from '@angular/core';
import { IProcedimentoRequest, IProcedimentoResponse } from '../../shared';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcedimentosService {
  private readonly _httpClient = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/procedimentos`;

  httpOptions = {
    observe: "response" as "response",
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  listar(id: number): Observable<IProcedimentoResponse[]> {
    return this._httpClient.get<IProcedimentoResponse[]>(
      `${this.BASE_URL}/paciente/${id}`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<IProcedimentoResponse[]>) => resposta.body ?? []),
      catchError((erro) => throwError(() => erro))
    );
  }

  inserir(colposcopia: IProcedimentoRequest): Observable<IProcedimentoRequest> {
    return this._httpClient.post<IProcedimentoRequest>(
      this.BASE_URL,
      colposcopia
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  alterar(id: number, colposcopia: IProcedimentoRequest): Observable<IProcedimentoResponse> {
    return this._httpClient.put<IProcedimentoResponse>(
      `${this.BASE_URL}/${id}`,
      colposcopia
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }  
}
