import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments';
import { IProfissional } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private readonly _httpClient = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/perfil`;

  buscar(): Observable<IProfissional> {
    return this._httpClient.get<IProfissional>(this.BASE_URL).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }
}