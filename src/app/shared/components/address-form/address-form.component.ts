import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FormErrorComponent } from '../form-error/form-error.component';
import { ufsConstant } from '../../../core/constants/ufs.constant';
import { ViaCepService } from '../../../core/service/via-cep.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { CepDirective } from '../../directives/cep.directive';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormErrorComponent,
    CepDirective
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent {
  @Input({ required: true })
  form!: FormGroup;

  readonly ufs = ufsConstant;

  private readonly viaCepService = inject(ViaCepService);

  ngOnInit(): void {
    this.form.controls['cep'].valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((cep) => !!cep && cep.replace(/\D/g, '').length === 8),
      )
      .subscribe((cep) => {
        this.buscarCep(cep);
      });
  }

  private buscarCep(cep: string): void {
    this.viaCepService.buscarCep(cep).subscribe({
      next: (endereco) => {
        if (endereco.erro) {
          return;
        }

        this.form.patchValue({
          logradouro: endereco.logradouro,
          complemento: endereco.complemento,
          bairro: endereco.bairro,
          localidade: endereco.localidade,
          uf: endereco.uf,
        });
      },
      error: (err) => {
        console.error('Erro ao consultar CEP:', err);
      },
    });
  }
}
