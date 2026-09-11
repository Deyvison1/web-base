import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';

import localePt from '@angular/common/locales/pt';

import { registerLocaleData } from '@angular/common';

import { KeycloakService } from './app/core/service/keycloak.service';
import { App } from './app/app';

registerLocaleData(localePt);

const keycloakService = new KeycloakService();

keycloakService.init().then(() => {
  bootstrapApplication(App, {
    ...appConfig,
    providers: [{ provide: KeycloakService, useValue: keycloakService }, ...appConfig.providers],
  }).catch((err) => console.error(err));
});
