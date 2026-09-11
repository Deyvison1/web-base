import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { KeycloakService } from '../service/keycloak.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const keycloakService = inject(KeycloakService);

  if (!keycloakService.isLoggedIn()) {
    return next(req).pipe(
      tap({
        error: (error: HttpErrorResponse) => handleError(error, router),
      }),
    );
  }

  return from(keycloakService.getToken()).pipe(
    switchMap((token) => {
      const authenticatedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authenticatedRequest);
    }),
    tap({
      error: (error: HttpErrorResponse) => handleError(error, router),
    }),
  );
};

function handleError(error: HttpErrorResponse, router: Router): void {
  switch (error.status) {
    case 401:
      router.navigate(['/home']);
      break;

    case 403:
      router.navigate(['/forbidden']);
      break;

    case 400:
    case 404:
    case 409:
      console.warn('Erro na requisição:', error.error?.message ?? error.error);
      break;

    case 500:
      console.error('Erro interno do servidor. Tente novamente ou contate a equipe técnica.');
      break;

    default:
      console.error('Erro desconhecido. Contate o administrador do sistema.', error);
  }
}
