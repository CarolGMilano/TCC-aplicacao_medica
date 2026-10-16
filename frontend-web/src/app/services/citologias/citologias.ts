import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ICitologiaRequest, ICitologiaResponse } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class CitologiasService {
  private readonly _httpClient = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/citologias`;

  httpOptions = {
    observe: "response" as "response",
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  listar(id: number): Observable<ICitologiaResponse[]> {
    return this._httpClient.get<ICitologiaResponse[]>(
      `${this.BASE_URL}/paciente/${id}`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<ICitologiaResponse[]>) => resposta.body ?? []),
      catchError((erro) => throwError(() => erro))
    );
  }

  inserir(citologia: ICitologiaRequest): Observable<ICitologiaRequest> {
    return this._httpClient.post<ICitologiaRequest>(
      this.BASE_URL,
      citologia
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  alterar(id: number, citologia: ICitologiaRequest): Observable<ICitologiaResponse> {
    return this._httpClient.put<ICitologiaResponse>(
      `${this.BASE_URL}/${id}`,
      citologia
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }
}