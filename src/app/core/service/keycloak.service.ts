import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak?: Keycloak;

  async init(): Promise<void> {
    this.keycloak = new Keycloak(environment.keycloakConfig);

    try {
      await this.keycloak.init({
        onLoad: 'login-required',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      });

      console.log('Keycloak inicializado');
    } catch (error) {
      console.error('Erro ao inicializar o Keycloak:', error);
      throw error;
    }
  }

  getKeycloakInstance(): Keycloak {
    if (!this.keycloak) {
      throw new Error('Keycloak não inicializado');
    }

    return this.keycloak;
  }

  getDecodedToken() {
    return this.keycloak?.tokenParsed;
  }

  getRealmRoles(): string[] {
    return this.getDecodedToken()?.realm_access?.roles ?? [];
  }

  getClientRoles(clientId: string): string[] {
    return this.getDecodedToken()?.resource_access?.[clientId]?.roles ?? [];
  }

  getRoles(): string[] {
    return this.getRealmRoles();
  }

  getUserProfile(): {
    username: string;
    firstName?: string;
    lastName?: string;
  } | null {
    const token = this.getDecodedToken();

    if (!token) {
      return null;
    }

    return {
      username: token['preferred_username'] ?? '',
      firstName: token['given_name'],
      lastName: token['family_name'],
    };
  }

  hasAnyRole(roles: string[], clientId?: string): boolean {
    const userRoles = clientId ? this.getClientRoles(clientId) : this.getRealmRoles();

    return roles.some((role) => userRoles.includes(role));
  }

  async getToken(): Promise<string> {
    const keycloak = this.getKeycloakInstance();

    try {
      await keycloak.updateToken(30);

      if (!keycloak.token) {
        throw new Error('Token não disponível');
      }

      return keycloak.token;
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      throw new Error('Falha ao atualizar token');
    }
  }

  login(redirectUri: string = globalThis.location.origin): void {
    this.getKeycloakInstance().login({ redirectUri });
  }

  logout(): void {
    this.keycloak?.logout({
      redirectUri: globalThis.location.origin,
    });
  }

  isLoggedIn(): boolean {
    return !!this.keycloak?.token;
  }
}
