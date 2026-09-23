import { ChangeDetectionStrategy, Component, output, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PageHeader, ConfirmDialog } from '@supremenetwork/ui';

import { ProductResponseDTO } from '../../../shared/dto/response/product-response.dto';
import { ProductFilterDTO } from '../../../shared/dto/request/product-filter.dto';

import { PageConfig } from '../../../shared/dto/pagination-config';
import { DEFAULT_PAGE_CONFIG } from '../../../core/constants/default-paginator.constant';

import { ProductService } from '../../../core/service/product.service';
import { PageResponseDTO } from '../../../shared/dto/response/page-response.dto';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmDialogData } from '../../../shared/dto/confirm-dialog-data.dto';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../core/service/notification.service';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { ApiResponseDTO } from '../../../shared/dto/response/api-response.dto';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    PageHeader,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    ProductFilterComponent,
  ],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss',
})
export class ProductGridComponent {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  protected readonly displayedColumns: string[] = ['name', 'description', 'actions'];
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  dataSource: ProductResponseDTO[] = [];

  pageConfig: PageConfig<ProductFilterDTO> = {
    ...DEFAULT_PAGE_CONFIG,
    filters: {},
  };

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getAll(this.pageConfig).subscribe({
      next: (resp: PageResponseDTO<ProductResponseDTO[]>) => {
        this.dataSource = resp.data;
        this.pageConfig.totalElements = resp.total;
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(err);
      },
    });
  }

  onFilterChange(filter: ProductFilterDTO) {
    this.pageConfig.filters = filter;
    this.getProducts();
  }

  onPageChange(event: PageEvent): void {
    this.pageConfig.page = event.pageIndex;
    this.pageConfig.pageSize = event.pageSize;

    this.getProducts();
  }

  changeSortBy(sort: Sort): void {
    if (!sort.direction) {
      this.pageConfig.sort = 'creationDate,asc';
    } else {
      this.pageConfig.sort = `${sort.active},${sort.direction}`;
    }

    this.pageConfig.page = 0;

    this.getProducts();
  }

  newProduct(): void {
    this.router.navigateByUrl('/product/add');
  }

  editProduct(id: string): void {
    this.router.navigate(['/product/edit', id]);
  }

  confirmaticonDeleteClient(id: string, name: string): void {
    const data: ConfirmDialogData = {
      title: 'Excluir cliente',
      message: `Deseja realmente excluir produto "${name}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      icon: 'delete',
    };

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }
      this.deleteProduct(id);
    });
  }

  deleteProduct(id: string) {
    this.productService.delete(id).subscribe({
      next: (resp: ApiResponseDTO<void>) => {
        this.getProducts();
        this.notificationService.success(resp.message);
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(err);
      },
    });
  }
}
