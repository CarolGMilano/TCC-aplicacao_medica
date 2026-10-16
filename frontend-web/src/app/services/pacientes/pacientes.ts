import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { 
  IPaciente, 
  IPacienteResponse, 
  IPacienteCompletoRequest,
  StatusPaciente, 
  IPacienteCompletoResponse, 
  IPacienteEdicaoRequest, 
  IDadosGinecoObstetricosRequest, 
  IDadosGinecoObstetricos, 
  ISaudeSexualRequest, 
  ISaudeSexual, 
  IHistoricoTabagismoRequest, 
  IHistoricoTabagismo 
} from '../../shared';
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

  cadastrarCompleto(dados: IPacienteCompletoRequest): Observable<IPaciente> {
    return this._httpClient.post<IPaciente>(`${this.BASE_URL}/completo`, dados);
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

  buscar(id: number): Observable<IPacienteCompletoResponse> {
    return this._httpClient.get<IPacienteCompletoResponse>(
      `${this.BASE_URL}/${id}`
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  atualizar(idPaciente: number, paciente: IPacienteEdicaoRequest): Observable<IPaciente> {
    return this._httpClient.put<IPaciente>(
      `${this.BASE_URL}/${idPaciente}`,
      paciente
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  atualizarDadosGinecoObstetricos(idDados: number, dados: IDadosGinecoObstetricosRequest): Observable<IDadosGinecoObstetricos> {
    return this._httpClient.put<IDadosGinecoObstetricos>(
      `${environment.apiUrl}/historico/gineco-obstetrico/${idDados}`,
      dados
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  atualizarSaudeSexual(idDados: number, dados: ISaudeSexualRequest): Observable<ISaudeSexual> {
    return this._httpClient.put<ISaudeSexual>(
      `${environment.apiUrl}/historico/saude-sexual/${idDados}`,
      dados
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  atualizarHistoricoTabagista(idDados: number, dados: IHistoricoTabagismoRequest): Observable<IHistoricoTabagismo> {
    return this._httpClient.put<IHistoricoTabagismo>(
      `${environment.apiUrl}/historico/tabagismo/${idDados}`,
      dados
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  atualizarStatus(idPaciente: number, status: StatusPaciente): Observable<IPacienteResponse> {
    return this._httpClient.put<IPacienteResponse>(
      `${this.BASE_URL}/${idPaciente}/status`,
      null,
      {
        params: { status }
      }
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }
}