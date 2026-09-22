import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { Login } from './features/auth/login/login';
import { ListaPacientes } from './features/pacientes/lista-pacientes/lista-pacientes';
import { AppLayout } from './layout/app-layout/app-layout';

import { Profissionais, Perfil } from './pages';

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
        path: 'dashboard',
        component: Profissionais,
        /*
        data: {
          role: ['ADMINISTRADOR, MEDICO, RESIDENTE']
        }
        */
      },

      {
        path: 'profissionais',
        component: Profissionais,
        /*
        data: {
          role: ['ADMINISTRADOR']
        }
        */
      },
      
      {
        path: 'pacientes',
        component: ListaPacientes,
      },

      {
        path: 'novo-paciente',
        component: Profissionais,
        /*
        data: {
          role: ['ADMINISTRADOR, MEDICO, RESIDENTE']
        }
        */
      },

      {
        path: 'perfil',
        component: Perfil,
        /*
        data: {
          role: ['ADMINISTRADOR, MEDICO, RESIDENTE']
        }
        */
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
