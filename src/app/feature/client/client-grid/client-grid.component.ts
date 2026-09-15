import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClientResponseDTO } from '../../../shared/dto/response/client-response.dto';
import { ClientService } from '../../../core/service/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CpfCnpjPipe } from '../../../shared/pipe/cpf-cnpj.pipe';
import { DEFAULT_PAGE_CONFIG } from '../../../core/constants/default-paginator.constant';
import { PageConfig } from '../../../shared/dto/pagination-config';
import { PageResponseDTO } from '../../../shared/dto/response/page-response.dto';
import { ConfirmDialogData } from '../../../shared/dto/confirm-dialog-data.dto';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ClientPageResponse } from '../../../shared/dto/response/client-page-response.dto';

@Component({
  imports: [
    PageHeaderComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    CpfCnpjPipe,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-client-grid',
  styleUrl: './client-grid.component.scss',
  templateUrl: './client-grid.component.html',
})
export class ClientGridComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly service = inject(ClientService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  displayedColumns = ['name', 'documento', 'birthDate', 'contacts', 'contracts', 'actions'];
  dataSource: ClientResponseDTO[] = [];
  
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  search = '';
  pageConfig: PageConfig<string> = DEFAULT_PAGE_CONFIG;

  activeContracts!: number;
  inactiveContracts!: number;
  totalClients!: number;

  ngOnInit(): void {
    this.findAll();
  }

  ngAfterViewInit() {}

  clearSearch(): void {
    this.search = '';
    this.pageConfig.page = 0;
    this.pageConfig.filters = '';

    this.findAll();
  }

  findAll(): void {
    this.pageConfig.filters = this.search.trim();

    this.service.getAll(this.pageConfig).subscribe({
      next: (resp: ClientPageResponse) => {
        this.dataSource = resp.data;
        this.pageConfig.totalElements = resp.total;
        this.activeContracts = resp.totalActiveContracts;
        this.inactiveContracts = resp.totalInactiveContracts;
        this.totalClients = resp.totalCLients;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
  onPageChange(event: PageEvent): void {
    const pageSizeChanged = event.pageSize !== this.pageConfig.pageSize;

    this.pageConfig.pageSize = event.pageSize;
    this.pageConfig.page = pageSizeChanged ? 0 : event.pageIndex;

    this.findAll();
  }

  newClient(): void {
    this.router.navigateByUrl('client/add');
  }

  viewClient(id: string): void {
    this.router.navigate(['/client/view', id]);
  }

  changeSortBy(sort: Sort): void {
    if (!sort.direction) {
      this.pageConfig.sort = 'creationDate,asc';
    } else {
      this.pageConfig.sort = `${sort.active},${sort.direction}`;
    }

    this.findAll();
  }

  editClient(id: string): void {
    this.router.navigate(['/client/edit', id]);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private showError(error: HttpErrorResponse): void {
    const response = error.error;

    if (response?.data && Array.isArray(response.data)) {
      const messages = response.data as string[];

      const message =
        messages.length === 1 ? messages[0] : messages.map((item) => `- ${item}`).join('\n');

      this.snackBar.open(message, 'Fechar', {
        duration: 6000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar'],
      });

      return;
    }

    this.snackBar.open(response?.message ?? 'Ocorreu um erro ao realizar a operação.', 'Fechar', {
      duration: 6000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  deleteClient(client: ClientResponseDTO): void {
    const data: ConfirmDialogData = {
      title: 'Excluir cliente',
      message: `Deseja realmente excluir o cliente "${client.name}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      icon: 'delete',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.service.delete(client.id).subscribe({
        next: (resp) => {
          this.showSuccess(resp.message);
          this.findAll();
        },
        error: (err: HttpErrorResponse) => {
          this.showError(err);
        },
      });
    });
  }
}
