import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IPCRRequest, IPCRResponse } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class PcrsService {
  private readonly _httpClient = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/pcr`;

  httpOptions = {
    observe: "response" as "response",
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  listar(id: number): Observable<IPCRResponse[]> {
    return this._httpClient.get<IPCRResponse[]>(
      `${this.BASE_URL}/paciente/${id}`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<IPCRResponse[]>) => resposta.body ?? []),
      catchError((erro) => throwError(() => erro))
    );
  }

  inserir(pcr: IPCRRequest): Observable<IPCRRequest> {
    return this._httpClient.post<IPCRRequest>(
      this.BASE_URL,
      pcr
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  alterar(id: number, pcr: IPCRRequest): Observable<IPCRResponse> {
    return this._httpClient.put<IPCRResponse>(
      `${this.BASE_URL}/${id}`,
      pcr
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }
}
