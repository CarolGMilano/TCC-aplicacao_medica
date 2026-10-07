import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TipoUsuario } from '../../shared/models/EnumTipoUsuario';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.estaAutenticado()) return router.createUrlTree(['/login']);
  const roles = route.data['roles'] as TipoUsuario[] | undefined;
  return !roles || auth.possuiAlgumaRole(roles)
    ? true : router.createUrlTree(['/pacientes']);
};
