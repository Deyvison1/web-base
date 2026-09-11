import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../service/keycloak.service';

export const AuthGuard: CanActivateFn = (): boolean => {
  const auth = inject(KeycloakService);
  const router = inject(Router);
  const isLogado = auth.isLoggedIn();
  if (!isLogado) {
    router.navigateByUrl('/home');
  }
  return isLogado;
};
