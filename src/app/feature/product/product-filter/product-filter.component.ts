import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { NgxCurrency } from '@dintecom/ngx-currency';

import { CategoryService } from '../../../core/service/category.service';

import { KeyValueResponseDTO } from '../../../shared/dto/response/key-value-response.dto';
import { ProductFilterDTO } from '../../../shared/dto/request/product-filter.dto';
import { RouterLink } from '@angular/router';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule } from '@angular/material/datepicker';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgxCurrency,
    MatDatepickerModule,
],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
})
export class ProductFilterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);

  readonly searchEvent = output<ProductFilterDTO>();
  readonly clearEvent = output<void>();

  readonly panelOpenState = signal(false);

  categories: KeyValueResponseDTO[] = [];

  readonly form = this.fb.group({
    name: this.fb.nonNullable.control(''),
    categoryId: this.fb.control<string | null>(null),
    description: this.fb.nonNullable.control(''),
    speedDownload: this.fb.control<number | null>(null),
    speedUpload: this.fb.control<number | null>(null),
    valueWifi: this.fb.control<number | null>(null),
    value: this.fb.control<number | null>(null),
    taxaAdesao: this.fb.control<number | null>(null),
    creationDate: this.fb.control<string | null>(null),
  });

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAllCategory().subscribe({
      next: (response) => {
        this.categories = response.data ?? [];
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      },
    });
  }

  search(): void {
    this.searchEvent.emit(this.form.getRawValue() as ProductFilterDTO);
  }

  clear(): void {
    this.form.reset({
      name: '',
      categoryId: null,
      description: '',
      speedDownload: null,
      speedUpload: null,
      valueWifi: null,
      value: null,
      taxaAdesao: null,
      creationDate: null,
    });

    this.clearEvent.emit();
  }
}
