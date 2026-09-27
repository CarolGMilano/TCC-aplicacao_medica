import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { IPaciente, IPacienteResponse, StatusPaciente } from '../../shared';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private readonly _httpClient = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/pacientes`;

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
    status?: StatusPaciente
  ): Observable<IPacienteResponse | null> {
    let parametros = `?page=${pagina}&size=${tamanho}`;

    if (busca) {
      parametros += `&busca=${encodeURIComponent(busca)}`;
    }

    if (status) {
      parametros += `&status=${status}`;
    }

    return this._httpClient.get<IPacienteResponse>(
      `${this.BASE_URL}${parametros}`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<IPacienteResponse>) => resposta.body ?? null),
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

  buscar(id: number): Observable<IPaciente> {
    return this._httpClient.get<IPaciente>(
      `${this.BASE_URL}/${id}`
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }
}
