import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IColposcopiaRequest, IColposcopiaResponse } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class ColposcopiasService {
  private readonly _httpClient = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/colposcopias`;

  httpOptions = {
    observe: "response" as "response",
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  listar(id: number): Observable<IColposcopiaResponse[]> {
    return this._httpClient.get<IColposcopiaResponse[]>(
      `${this.BASE_URL}/paciente/${id}`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<IColposcopiaResponse[]>) => resposta.body ?? []),
      catchError((erro) => throwError(() => erro))
    );
  }

  inserir(colposcopia: IColposcopiaRequest): Observable<IColposcopiaRequest> {
    return this._httpClient.post<IColposcopiaRequest>(
      this.BASE_URL,
      colposcopia
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  alterar(id: number, colposcopia: IColposcopiaRequest): Observable<IColposcopiaResponse> {
    return this._httpClient.put<IColposcopiaResponse>(
      `${this.BASE_URL}/${id}`,
      colposcopia
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }  
}
