import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { TipoUsuario } from './shared';
import { Login } from './features/auth/login/login';
import { AppLayout } from './layout/app-layout/app-layout';

import { 
  Dashboard, 
  Perfil, 
  Pacientes, 
  Paciente, 
  Profissionais, 
  NovoPaciente 
} from './pages';

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
        component: Dashboard,
        data: {
          roles: [
            TipoUsuario.ADMINISTRADOR, 
            TipoUsuario.MEDICO, 
            TipoUsuario.RESIDENTE
          ]
        }
      },

      {
        path: 'profissionais',
        component: Profissionais,
        data: { 
          roles: [
            TipoUsuario.ADMINISTRADOR
          ] 
        },
      },
      
      {
        path: 'pacientes',
        component: Pacientes,        
        data: {
          roles: [
            TipoUsuario.ADMINISTRADOR, 
            TipoUsuario.MEDICO, 
            TipoUsuario.RESIDENTE
          ]
        }
      },

      { 
        path: 'pacientes/:id', 
        component: Paciente,
        data: {
          roles: [
            TipoUsuario.ADMINISTRADOR, 
            TipoUsuario.MEDICO, 
            TipoUsuario.RESIDENTE
          ]
        }
      },
      
      {
        path: 'novo-paciente',
        component: NovoPaciente,
        canDeactivate: [
          (component: NovoPaciente) => 
            !component.formulario.dirty || window.confirm('Descartar os dados ainda não cadastrados?')
        ],
        data: { 
          roles: [
            TipoUsuario.ADMINISTRADOR, 
            TipoUsuario.MEDICO, 
            TipoUsuario.RESIDENTE
          ]
        }
      },

      {
        path: 'perfil',
        component: Perfil,
        data: {
          roles: [
            TipoUsuario.ADMINISTRADOR, 
            TipoUsuario.MEDICO, 
            TipoUsuario.RESIDENTE
          ]
        }
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