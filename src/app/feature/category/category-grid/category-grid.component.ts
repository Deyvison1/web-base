import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { MatSortModule, Sort } from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { CategoryResponseDTO } from '../../../shared/dto/response/category-response.dto';
import { CategorySearchRequestDTO } from '../../../shared/dto/request/category-search-request.dto';
import { PageConfig } from '../../../shared/dto/pagination-config';

import { DEFAULT_PAGE_CONFIG } from '../../../core/constants/default-paginator.constant';
import { CategoryService } from '../../../core/service/category.service';
import { PageResponseDTO } from '../../../shared/dto/response/page-response.dto';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';

@Component({
  selector: 'app-category-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    PageHeaderComponent,
    CategoryFilterComponent
],
  templateUrl: './category-grid.component.html',
  styleUrl: './category-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CategoryGridComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

  readonly displayedColumns: string[] = ['name', 'description', 'actions'];

  dataSource: CategoryResponseDTO[] = [];

  pageConfig: PageConfig<CategorySearchRequestDTO> = {
    ...DEFAULT_PAGE_CONFIG,
    filters: {},
  };

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getAllCategoryPage(this.pageConfig).subscribe({
      next: (response: PageResponseDTO<CategoryResponseDTO[]>) => {
        this.dataSource = response.data ?? [];
        this.pageConfig.totalElements = response.total ?? 0;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.dataSource = [];
        this.pageConfig.totalElements = 0;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageConfig.page = event.pageIndex;
    this.pageConfig.pageSize = event.pageSize;

    this.getCategories();
  }

  changeSortBy(sort: Sort): void {
    if (!sort.direction) {
      this.pageConfig.sort = 'creationDate,asc';
    } else {
      this.pageConfig.sort = `${sort.active},${sort.direction}`;
    }

    this.pageConfig.page = 0;

    this.getCategories();
  }

  onFilterChange(filters: CategorySearchRequestDTO): void {
    this.pageConfig.filters = filters;
    this.pageConfig.page = 0;

    this.getCategories();
  }

  newCategory(): void {
    this.router.navigate(['/category/add']);
  }

  editCategory(id: string): void {
    this.router.navigate(['/category/edit', id]);
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.getCategories();
      },
      error: (error) => {
        console.error('Erro ao excluir categoria:', error);
      },
    });
  }
}
