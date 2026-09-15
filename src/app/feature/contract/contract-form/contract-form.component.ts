import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

import { KeyValueResponseDTO } from '../../../shared/dto/response/key-value-response.dto';
import { ufsConstant } from '../../../core/constants/ufs.constant';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { ClientResponseDTO } from '../../../shared/dto/response/client-response.dto';
import { ProductResponseDTO } from '../../../shared/dto/response/product-response.dto';
import { ProductService } from '../../../core/service/product.service';
import { ApiResponseDTO } from '../../../shared/dto/response/api-response.dto';
import { NgxCurrency } from '@dintecom/ngx-currency';
import { AddressFormComponent } from '../../../shared/components/address-form/address-form.component';
import { ContractFormGroup } from '../../client/client-form/client-form.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    FormErrorComponent,
    NgxCurrency,
    AddressFormComponent,
  ],
  templateUrl: './contract-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contract-form.component.scss',
})
export class ContractFormComponent implements OnInit {
  @Input({ required: true })
  form!: ContractFormGroup;

  @Input({ required: true })
  index!: number;

  @Input({ required: true })
  products: KeyValueResponseDTO[] = [];

  @Input()
  clientResponse?: ClientResponseDTO;

  @Output()
  adicionarNovoContrato = new EventEmitter<void>();

  @Output()
  removeContract = new EventEmitter<void>();

  readonly ufs: string[] = ufsConstant;

  selectedProduct?: ProductResponseDTO;

  private readonly productService = inject(ProductService);

  ngOnInit(): void {}

  public selectProduct(productId: string | null): void {
    if (!productId) {
      this.selectedProduct = undefined;
      return;
    }

    const contract = this.clientResponse?.contracts?.[this.index];

    if (contract?.product?.id === productId) {
      this.selectedProduct = contract.product;
      return;
    }

    this.loadProduct(productId);
  }

  adicionarContrato(): void {
    this.adicionarNovoContrato.emit();
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>): void {
    const startDate = event.value;

    if (!startDate) {
      return;
    }

    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setDate(endDate.getDate() - 1);

    this.form.controls['endDate'].setValue(endDate);
  }

  private loadProduct(productId: string): void {
    this.productService.getById(productId).subscribe({
      next: (resp: ApiResponseDTO<ProductResponseDTO>) => {
        this.selectedProduct = resp.data;
      },
      error: (err) => {
        console.error(err);
        this.selectedProduct = undefined;
      },
    });
  }

  compareFn(c1: string | null, c2: string | null): boolean {
    return c1 === c2;
  }

  remover(): void {
    this.removeContract.emit();
  }
}
