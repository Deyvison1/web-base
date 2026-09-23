import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PageHeader } from '@supremenetwork/ui';

import { ClientResponseDTO } from '../../../shared/dto/response/client-response.dto';
import { ClientService } from '../../../core/service/client.service';
import { CpfCnpjPipe } from '../../../shared/pipe/cpf-cnpj.pipe';
import { ContactPipe } from '../../../shared/pipe/contact.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../../core/service/notification.service';

@Component({
  imports: [
    DatePipe,
    PageHeader,
    CpfCnpjPipe,
    MatButtonModule,
    CurrencyPipe,
    MatIconModule,
    ContactPipe,
    MatTooltipModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-client-view',
  styleUrl: './client-view.component.scss',
  templateUrl: './client-view.component.html',
})
export class ClientViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);

  private readonly router = inject(Router);
  private readonly service = inject(ClientService);
  private readonly snackBar = inject(MatSnackBar);

  client!: ClientResponseDTO;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/client']);
      return;
    }

    this.loadClient(id);
  }

  copyContact(value: string): void {
    navigator.clipboard.writeText(value);
    this.snackBar.open('Contato copiado com sucesso', 'Fechar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private loadClient(id: string): void {
    this.service.getById(id).subscribe({
      next: (resp) => {
        this.client = resp.data;
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(err);
      },
    });
  }

  editClient(): void {
    if (!this.client.id) {
      return;
    }

    this.router.navigate(['/client/edit', this.client.id]);
  }
}
