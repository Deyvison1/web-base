import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { KeycloakService } from './core/service/keycloak.service';
import { SIDEBAR_MENU } from './core/constants/sidebar-menu.constant';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
    FooterComponent,
    MatMenuModule,
    LoadingComponent,
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('supremenetwork-client-web');

  private readonly keycloakService: KeycloakService = inject(KeycloakService);
  readonly menuItems = SIDEBAR_MENU;

  get getUserName(): string | undefined {
    return this.keycloakService.getUserProfile()?.username;
  }

  logout(): void {
    this.keycloakService.logout();
  }
}
