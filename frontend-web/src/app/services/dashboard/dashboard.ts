import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments';
import { IGraficoEtarioResponse, IGraficoISTResponse, IHistoricoIndicadoresResponse, IKPIResponse, IListaPacienteResponse, IPendenciaResponse } from '../../shared';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly _httpClient = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/dashboard`;

  httpOptions = {
    observe: "response" as "response",
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  buscarKPI(): Observable<IKPIResponse> {
    return this._httpClient.get<IKPIResponse>(
      `${this.BASE_URL}/kpis`
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  listarPendenciaVerETratar(): Observable<IPendenciaResponse[]> {
    return this._httpClient.get<IPendenciaResponse[]>(
      `${this.BASE_URL}/alertas/ver-e-tratar`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<IPendenciaResponse[]>) => resposta.body ?? []),
      catchError((erro) => throwError(() => erro))
    );
  }

  listarPosProcedimento(): Observable<IPendenciaResponse[]> {
    return this._httpClient.get<IPendenciaResponse[]>(
      `${this.BASE_URL}/alertas/pos-procedimento`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<IPendenciaResponse[]>) => resposta.body ?? []),
      catchError((erro) => throwError(() => erro))
    );
  }

  graficoDistribuicaoEtaria(): Observable<IGraficoEtarioResponse[]> {
    return this._httpClient.get<IGraficoEtarioResponse[]>(
      `${this.BASE_URL}/distribuicao-etaria`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<IGraficoEtarioResponse[]>) => resposta.body ?? []),
      catchError((erro) => throwError(() => erro))
    );
  }

  graficoDistribuicaoIST(): Observable<IGraficoISTResponse[]> {
    return this._httpClient.get<IGraficoISTResponse[]>(
      `${this.BASE_URL}/distribuicao-ist`,
      { observe: 'response' }
    ).pipe(
      map((resposta: HttpResponse<IGraficoISTResponse[]>) => resposta.body ?? []),
      catchError((erro) => throwError(() => erro))
    );
  }

  graficoIndicadores(): Observable<IHistoricoIndicadoresResponse> {
    return this._httpClient.get<IHistoricoIndicadoresResponse>(
      `${this.BASE_URL}/historico-indicadores`,
    ).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  pacientesPorFaixaEtaria(faixa: string): Observable<IListaPacienteResponse[]> {
    return this._httpClient.get<IListaPacienteResponse[]>(
      `${this.BASE_URL}/pacientes/faixa-etaria`,
      {
        params: { faixa },
        observe: 'response',
      }
    ).pipe(
      map((resposta: HttpResponse<IListaPacienteResponse[]>) =>
        resposta.body ?? []
      ),
      catchError((erro) => throwError(() => erro))
    );
  }

  pacientesPorIST(ist: string): Observable<IListaPacienteResponse[]> {
    return this._httpClient.get<IListaPacienteResponse[]>(
      `${this.BASE_URL}/pacientes/ist`,
      {
        params: { ist },
        observe: 'response',
      }
    ).pipe(
      map((resposta: HttpResponse<IListaPacienteResponse[]>) =>
        resposta.body ?? []
      ),
      catchError((erro) => throwError(() => erro))
    );
  }

  pacientesRecidiva(): Observable<IListaPacienteResponse[]> {
    return this._httpClient.get<IListaPacienteResponse[]>(
      `${this.BASE_URL}/pacientes/recidiva`,
      {
        params: { status: true },
        observe: 'response',
      }
    ).pipe(
      map((resposta: HttpResponse<IListaPacienteResponse[]>) =>
        resposta.body ?? []
      ),
      catchError((erro) => throwError(() => erro))
    );
  }

  pacientesVerETratar(): Observable<IListaPacienteResponse[]> {
    return this._httpClient.get<IListaPacienteResponse[]>(
      `${this.BASE_URL}/pacientes/ver-e-tratar`,
      {
        params: { status: true },
        observe: 'response',
      }
    ).pipe(
      map((resposta: HttpResponse<IListaPacienteResponse[]>) =>
        resposta.body ?? []
      ),
      catchError((erro) => throwError(() => erro))
    );
  }
}