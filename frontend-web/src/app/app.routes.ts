import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { TipoUsuario } from './shared/models/EnumTipoUsuario';
import { Login } from './features/auth/login/login';
import { AppLayout } from './layout/app-layout/app-layout';

import { Profissionais, Perfil, Pacientes, NovoPaciente } from './pages';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard, roleGuard],
    children: [
      {
        path: 'dashboard',
        redirectTo: 'pacientes',
        pathMatch: 'full',
        /*
        data: {
          role: ['ADMINISTRADOR, MEDICO, RESIDENTE']
        }
        */
      },

      {
        path: 'profissionais',
        component: Profissionais,
        data: { roles: [TipoUsuario.ADMINISTRADOR] },
        /*
        data: {
          role: ['ADMINISTRADOR']
        }
        */
      },
      
      {
        path: 'pacientes',
        component: Pacientes,        
        /*
        data: {
          role: ['ADMINISTRADOR, MEDICO, RESIDENTE']
        }
        */
      },

      /*
      { 
        path: 'pacientes/:id', 
        component: Paciente,
        
        data: {
          role: ['ADMINISTRADOR, MEDICO, RESIDENTE']
        }
        
      },
      */

      {
        path: 'novo-paciente',
        component: NovoPaciente,
        canDeactivate: [(component: NovoPaciente) => !component.formulario.dirty || window.confirm('Descartar os dados ainda não cadastrados?')],
        data: { roles: [TipoUsuario.ADMINISTRADOR, TipoUsuario.MEDICO, TipoUsuario.RESIDENTE] },
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
