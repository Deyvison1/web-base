export const environment = {
  production: true,
  apiUrl: 'http://localhost:8084/api/v1',
  viaCepApi: 'https://viacep.com.br/ws/',
  keycloakConfig: {
    url: 'https://auth.animal-adoption.com.br',
    realm: 'MY_KEYCLOAK',
    clientId: 'SUPREME_NETWORK_CLIENT_APP',
    urlAccount:
      'https://auth.animal-adoption.com.br/realms/MY_KEYCLOAK/account/',
  },
};