import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SIDEBAR_MENU } from '../../../core/constants/sidebar-menu.constant';
import { FooterComponent } from '../footer/footer.component';
import { KeycloakService } from '../../../core/service/keycloak.service';
import { MatMenuModule } from '@angular/material/menu';
@Component({
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
  ],
  selector: 'app-layout',
  styleUrl: './layout.component.scss',
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  private readonly keycloakService: KeycloakService = inject(KeycloakService);
  readonly menuItems = SIDEBAR_MENU;

  get getUserName(): string | undefined {
    console.log(this.keycloakService.getUserProfile());
    return this.keycloakService.getUserProfile()?.username;
  }

  logout(): void {
    this.keycloakService.logout();
  }
}