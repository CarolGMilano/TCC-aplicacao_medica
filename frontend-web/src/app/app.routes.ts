import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { ListaPacientes } from './features/pacientes/lista-pacientes/lista-pacientes';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'pacientes',
    component: ListaPacientes,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
