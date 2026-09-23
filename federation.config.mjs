import { withNativeFederation, shareAll } from '@angular-architects/native-federation/config';

export default withNativeFederation({
  name: 'supremenetwork-client-web',

  remotes: {
    'keycloak-user-mf': 'http://localhost:4201/remoteEntry.json',
  },

  exposes: {
    './Routes': './src/app/app.routes.ts',
  },

  shared: {
    ...shareAll(
      {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        build: 'package',
      },
      {
        overrides: {
          '@angular/core': {
            singleton: true,
            strictVersion: true,
            requiredVersion: 'auto',
            build: 'package',
            includeSecondaries: { keepAll: true },
          },

          '@angular/common': {
            singleton: true,
            strictVersion: true,
            requiredVersion: 'auto',
            build: 'package',
            includeSecondaries: { keepAll: true },
          },

          '@angular/compiler': {
            singleton: true,
            strictVersion: true,
            requiredVersion: 'auto',
            build: 'package',
          },
        },
      },
    ),
  },

  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket', '@angular/common/locales/pt'],

  features: {
    denseChunking: true,
  },
});
