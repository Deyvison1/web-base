import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoryService } from '../../../core/service/category.service';
import { CategoryRequestDTO } from '../../../shared/dto/request/category-request.dto';

import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';

import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ApiResponseDTO } from '../../../shared/dto/response/api-response.dto';
import { CategoryResponseDTO } from '../../../shared/dto/response/category-response.dto';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatIcon,
    FormErrorComponent,
    MatError,
    MatFormField,
    MatLabel,
    PageHeaderComponent,
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

  private loadCategory(id: string): void {
    this.categoryService.findByIdComplet(id).subscribe({
      next: (resp: ApiResponseDTO<CategoryResponseDTO>) => {
        const category = resp.data;
        this.form.patchValue({
          name: category.name,
          description: category.description,
        });
      },
      error: (error) => {
        console.error('Erro ao carregar categoria:', error);
      },
    });
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

  private insert(request: CategoryRequestDTO): void {
    this.categoryService.insertCategory(request).subscribe({
      next: () => {
        // sucesso
      },
      error: (error) => {
        console.error('Erro ao cadastrar categoria:', error);
      },
    });
  }

  private update(id: string, request: CategoryRequestDTO): void {
    this.categoryService.editCategory(id, request).subscribe({
      next: () => {
        // sucesso
      },
      error: (error) => {
        console.error('Erro ao atualizar categoria:', error);
      },
    });
  }
}
