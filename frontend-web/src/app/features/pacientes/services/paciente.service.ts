import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Paciente, Pagina } from '../models/paciente.model';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/pacientes`;

  listar(): Observable<Pagina<Paciente>> {
    return this.http.get<Pagina<Paciente>>(this.apiUrl);
  }
}
