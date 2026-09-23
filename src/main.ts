import '@angular/compiler';

import { initFederation } from '@angular-architects/native-federation';

initFederation({
  'keycloak-user-mf': 'http://localhost:4201/remoteEntry.json',
})
  .catch((err) => console.error(err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
