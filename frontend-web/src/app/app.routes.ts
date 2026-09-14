import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { Login } from './features/auth/login/login';
import { ListaPacientes } from './features/pacientes/lista-pacientes/lista-pacientes';
import { AppLayout } from './layout/app-layout/app-layout';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'pacientes',
        component: ListaPacientes,
      },
      {
        path: '',
        redirectTo: 'pacientes',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
