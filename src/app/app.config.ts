import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { authTokenInterceptor } from './core/interceptor/auth-token.interceptor';
import { LoadingInterceptor } from './core/interceptor/loading.interceptor';
import { KeycloakService } from './core/service/keycloak.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor, LoadingInterceptor])),
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pt-BR',
    },
    provideAppInitializer(() => {
      const keycloakService = inject(KeycloakService);
      return keycloakService.init();
    }),
  ],
};
