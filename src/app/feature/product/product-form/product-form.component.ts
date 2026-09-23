import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { NgxCurrency } from '@dintecom/ngx-currency';

import { CategoryService } from '../../../core/service/category.service';
import { ProductService } from '../../../core/service/product.service';

import { PageHeader, FormError } from '@supremenetwork/ui';

import { ApiResponseDTO } from '../../../shared/dto/response/api-response.dto';
import { KeyValueResponseDTO } from '../../../shared/dto/response/key-value-response.dto';
import { ProductRequestDTO } from '../../../shared/dto/request/product-request.dto';
import { ProductResponseDTO, ProductSimpleResponseDTO } from '../../../shared/dto/response/product-response.dto';
import { NotificationService } from '../../../core/service/notification.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgxCurrency,
    FormError,
    PageHeader,
    RouterLink,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  readonly title = 'Produto';
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly productService = inject(ProductService);

  id?: string;

  categories: KeyValueResponseDTO[] = [];

  readonly form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    speedDownload: this.fb.control<number | null>(null, Validators.required),
    speedUpload: this.fb.control<number | null>(null, Validators.required),
    taxaAdesao: this.fb.control<number | null>(null, Validators.required),
    valueWifi: this.fb.control<number | null>(null, Validators.required),
    value: this.fb.control<number | null>(null, Validators.required),
    description: this.fb.nonNullable.control('', Validators.required),
    categoryId: this.fb.control<string | null>(null, Validators.required),
  });

  get isEdit(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? undefined;

    this.loadCategories();

    if (this.id) {
      this.loadProduct(this.id);
    }
  }

  private loadProduct(id: string): void {
    this.productService.getById(id).subscribe({
      next: (response: ApiResponseDTO<ProductSimpleResponseDTO>) => {
        this.setProductForm(response.data);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(error);
      },
    });
  }

  private setProductForm(product: ProductSimpleResponseDTO): void {
    this.form.patchValue({
      name: product.name,
      speedDownload: product.speedDownload,
      speedUpload: product.speedUpload,
      taxaAdesao: product.taxaAdesao,
      valueWifi: product.valueWifi,
      value: product.value,
      description: product.description,
      categoryId: product.categoryId ?? null,
    });
  }

  private loadCategories(): void {
    this.categoryService.getAllCategory().subscribe({
      next: (response: ApiResponseDTO<KeyValueResponseDTO[]>) => {
        this.categories = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(error);
      },
    });
  }

  private add(product: ProductRequestDTO): void {
    this.productService.insert(product).subscribe({
      next: (response: ApiResponseDTO<ProductResponseDTO>) => {
        this.notificationService.success(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(error);
      },
    });
  }

  private edit(id: string, product: ProductRequestDTO): void {
    this.productService.update(id, product).subscribe({
      next: (response: ApiResponseDTO<ProductResponseDTO>) => {
        this.notificationService.success(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(error);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const product = this.form.getRawValue() as ProductRequestDTO;

    if (this.id) {
      this.edit(this.id, product);
      return;
    }

    this.add(product);
  }
}
