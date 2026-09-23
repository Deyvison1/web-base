import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoryService } from '../../../core/service/category.service';
import { CategoryRequestDTO } from '../../../shared/dto/request/category-request.dto';

import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';

import { PageHeader, FormError } from '@supremenetwork/ui';
import { ApiResponseDTO } from '../../../shared/dto/response/api-response.dto';
import { CategoryResponseDTO } from '../../../shared/dto/response/category-response.dto';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../../core/service/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatIcon,
    FormError,
    MatError,
    MatFormField,
    MatLabel,
    PageHeader,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  selector: 'app-category-form',
  styleUrl: './category-form.component.scss',
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  title = 'Adicionar categoria';
  id?: string;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.id) {
      this.title = 'Editar categoria';
      this.loadCategory(this.id);
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: CategoryRequestDTO = this.form.getRawValue() as CategoryRequestDTO;

    if (this.id) {
      this.update(this.id, request);
      return;
    }

    this.insert(request);
  }

  private loadCategory(id: string): void {
    this.categoryService.findByIdComplet(id).subscribe({
      next: (resp: ApiResponseDTO<CategoryResponseDTO>) => {
        const category = resp.data;
        this.form.patchValue({
          name: category.name,
          description: category.description,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(error);
      },
    });
  }

  private insert(request: CategoryRequestDTO): void {
    this.categoryService.insertCategory(request).subscribe({
      next: (resp: ApiResponseDTO<CategoryResponseDTO>) => {
        this.notificationService.success(resp.message);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(error);
      },
    });
  }

  private update(id: string, request: CategoryRequestDTO): void {
    this.categoryService.editCategory(id, request).subscribe({
      next: (resp: ApiResponseDTO<CategoryResponseDTO>) => {
        this.notificationService.success(resp.message);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(error);
      },
    });
  }
}
