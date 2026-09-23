import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatIconModule, MatButtonModule],
  selector: 'app-forbidden',
  styleUrl: './forbidden.component.scss',
  templateUrl: './forbidden.component.html',
})
export class ForbiddenComponent {
  private readonly router = inject(Router);

  goHome(): void {
    this.router.navigate(['/']);
  }
}
