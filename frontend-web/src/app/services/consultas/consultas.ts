import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { IConsultaRequest, IConsultaResponse } from '../../shared';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultasService {
  private readonly _httpClient = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/consultas`;

  httpOptions = {
    observe: "response" as "response",
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  listar(id: number): Observable<IConsultaResponse[]> {
    return this._httpClient.get<IConsultaResponse[]>(
      `${this.BASE_URL}/paciente/${id}`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<IConsultaResponse[]>) => resposta.body ?? []),
      catchError((erro) => throwError(() => erro))
    );
  }

  inserir(consulta: IConsultaRequest): Observable<IConsultaRequest> {
    return this._httpClient.post<IConsultaRequest>(
      this.BASE_URL,
      consulta
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }
}