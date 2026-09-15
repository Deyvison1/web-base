import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CpfCnpjDirective } from '../../../shared/directives/cpf-cnpj.directive';
import { nameValidator } from '../../../shared/validators/name.validator';
import { dateBeforeTodayValidator } from '../../../shared/validators/date-before-today.validator';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { documentValidator } from '../../../shared/validators/document.validator';
import { ContactFormComponent } from '../../../shared/components/contact-form/contact-form.component';
import { contactValidator } from '../../../shared/validators/contact.validator';
import { onlyOnePrimaryValidator } from '../../../shared/validators/only-one-primary.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../../core/service/client.service';
import { ClientRequestDTO } from '../../../shared/dto/request/client-request.dto';
import { ApiResponseDTO } from '../../../shared/dto/response/api-response.dto';
import { ClientResponseDTO } from '../../../shared/dto/response/client-response.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { formatLocalDate } from '../../../shared/utils/format-date.utils';
import { ContactResponseDTO } from '../../../shared/dto/response/contact-response.dto';
import { ContractFormComponent } from '../../contract/contract-form/contract-form.component';
import { ContractResponseDTO } from '../../../shared/dto/response/contract-response.dto';
import { KeyValueResponseDTO } from '../../../shared/dto/response/key-value-response.dto';
import { ProductService } from '../../../core/service/product.service';
import { map, Observable } from 'rxjs';
import { ProductResponseDTO } from '../../../shared/dto/response/product-response.dto';

type ContactFormGroup = FormGroup<{
  value: FormControl<string>;
  whatsapp: FormControl<boolean>;
  primaryContact: FormControl<boolean>;
}>;

export type ContractFormGroup = FormGroup<{
  productId: FormControl<string>;
  address: FormGroup<{
    cep: FormControl<string>;
    logradouro: FormControl<string>;
    complemento: FormControl<string>;
    bairro: FormControl<string>;
    localidade: FormControl<string>;
    uf: FormControl<string>;
  }>;
  value: FormControl<number | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  active: FormControl<boolean>;
}>;

@Component({
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    PageHeaderComponent,
    MatDatepickerModule,
    MatIconModule,
    CpfCnpjDirective,
    ReactiveFormsModule,
    FormErrorComponent,
    ContactFormComponent,
    RouterLink,
    MatTabsModule,
    ContractFormComponent,
  ],
  providers: [provideNativeDateAdapter()],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-client-form',
  styleUrl: './client-form.component.scss',
  templateUrl: './client-form.component.html',
})
export class ClientFormComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly service = inject(ClientService);
  readonly pathToBack: string = 'client';
  title: string = 'Cadastro de Cliente';
  id?: string;
  products: KeyValueResponseDTO[] = [];

  form = this.fb.nonNullable.group({
    documento: ['', [Validators.required, documentValidator()]],
    name: ['', [Validators.required]],
    birthDate: this.fb.control<Date | null>(null, dateBeforeTodayValidator()),
    observation: this.fb.nonNullable.control(''),
    contacts: this.fb.array<ContactFormGroup>([], {
      validators: [onlyOnePrimaryValidator()],
    }),
    contracts: this.fb.array<ContractFormGroup>([]),
  });

  clientResponse?: ClientResponseDTO;

  get contacts(): FormArray<FormGroup> {
    return this.form.controls.contacts;
  }

  get contracts(): FormArray<FormGroup> {
    return this.form.controls.contracts;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? undefined;

    this.form.controls.documento.valueChanges.subscribe(() => {
      this.updateValidationName();
      this.updateValidationBirthDate();
    });

    this.listOptionsProducts().subscribe({
      next: (products) => {
        this.products = products;

        // Edição
        if (this.id) {
          this.loadClient(this.id);
          return;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  private criarFormContrato(): ContractFormGroup {
    return this.fb.group({
      productId: this.fb.nonNullable.control('', [Validators.required]),

      address: this.fb.group({
        cep: this.fb.nonNullable.control('', [Validators.required]),
        logradouro: this.fb.nonNullable.control(''),
        complemento: this.fb.nonNullable.control(''),
        bairro: this.fb.nonNullable.control('', [Validators.required]),
        localidade: this.fb.nonNullable.control('', [Validators.required]),
        uf: this.fb.nonNullable.control('', [Validators.required]),
      }),

      value: this.fb.control<number | null>(null, Validators.required),

      startDate: this.fb.control<Date | null>(null, Validators.required),

      endDate: this.fb.control<Date | null>(null),

      active: this.fb.nonNullable.control(true),
    });
  }

  private loadClient(id: string) {
    this.service.getById(id).subscribe({
      next: (resp: ApiResponseDTO<ClientResponseDTO>) => {
        this.setValueForm(resp.data);
        this.clientResponse = resp.data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  private updateValidationName(): void {
    const nameControl = this.form.controls.name;

    if (this.isCpf()) {
      nameControl.setValidators([Validators.required, nameValidator]);
    } else {
      nameControl.setValidators([Validators.required]);
    }

    nameControl.updateValueAndValidity({ emitEvent: false });
  }

  private updateValidationBirthDate(): void {
    const birthDateControl = this.form.controls.birthDate;

    if (this.isCpf()) {
      birthDateControl.setValidators([Validators.required, dateBeforeTodayValidator()]);
    } else {
      birthDateControl.removeValidators([Validators.required, dateBeforeTodayValidator()]);
    }

    birthDateControl.updateValueAndValidity({ emitEvent: false });
  }

  private criarFormContato(): FormGroup {
    return this.fb.group({
      whatsapp: [false, Validators.required],
      primaryContact: [false, Validators.required],
      value: ['', [Validators.required, contactValidator]],
    });
  }

  isFormClientValid(): boolean {
    const documento = this.form.controls['documento'];
    const name = this.form.controls['name'];
    const birthDate = this.form.controls['birthDate'];

    return (
      documento.valid &&
      name.valid &&
      birthDate.valid &&
      this.contacts.length > 0 &&
      this.contacts.valid
    );
  }

  onPrimaryChanged(index: number, checked: boolean): void {
    if (!checked) {
      return;
    }

    const alreadyHasPrimary = this.contacts.controls.some(
      (contact, i) => i !== index && contact.controls['primaryContact'].value === true,
    );

    if (!alreadyHasPrimary) {
      return;
    }

    this.contacts.at(index).controls['primaryContact'].setValue(false);

    this.snackBar.open('Só é possível marcar um contato como principal.', 'Fechar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  adicionarContato(): void {
    this.contacts.push(this.criarFormContato());
  }

  removerContato(index: number): void {
    this.contacts.removeAt(index);
  }

  removerContract(index: number): void {
    this.contracts.removeAt(index);
  }

  isCpf(): boolean {
    const documento = this.form.controls.documento.value;

    if (!documento) {
      return false;
    }

    return documento.replace(/\D/g, '').length === 11;
  }

  save(): void {
    const value = this.form.getRawValue();

    const client: ClientRequestDTO = {
      ...value,
      birthDate: formatLocalDate(value.birthDate),
      contracts: [],
    };
    console.log(this.form.valid);
    return;

    this.service.add(client).subscribe({
      next: (resp: ApiResponseDTO<ClientResponseDTO>) => {
        const clientResponse: ClientResponseDTO = resp.data;
        this.setValueForm(clientResponse);
        this.title = 'Atualizar client ' + clientResponse.name;
        this.showSuccess(resp.message);
      },

      error: (err: HttpErrorResponse) => {
        this.showError(err);
      },
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

  onTabChange(index: number): void {
    if (index !== 1) {
      return;
    }

    if (this.contracts.length === 0) {
      this.contracts.push(this.criarFormContrato());
    }
  }

  private setValueForm(clientResponse: ClientResponseDTO): void {
    this.form.patchValue({
      documento: clientResponse.documento,
      name: clientResponse.name,
      birthDate: clientResponse.birthDate,
      observation: clientResponse.observation,
    });

    this.carregarContatos(clientResponse.contacts);

    if (clientResponse.contracts.length) {
      this.carregarContratos(clientResponse.contracts);
    }
  }

  private listOptionsProducts(): Observable<KeyValueResponseDTO[]> {
    return this.productService.listOptions().pipe(map((resp) => resp.data));
  }

  private carregarContratos(contracts: ContractResponseDTO[]): void {
    this.contracts.clear();

    for (const contract of contracts) {
      const formContract = this.criarFormContrato();

      formContract.patchValue({
        productId: contract.product.id,
        value: contract.value,
        startDate: contract.startDate ? new Date(`${contract.startDate}T00:00:00`) : null,
        endDate: contract.endDate ? new Date(`${contract.endDate}T00:00:00`) : null,
        active: contract.active,
      });

      formContract.controls.address.patchValue({
        cep: this.formatarCep(contract.address?.cep),
        logradouro: contract.address?.logradouro ?? '',
        complemento: contract.address?.complemento ?? '',
        bairro: contract.address?.bairro ?? '',
        localidade: contract.address?.localidade ?? '',
        uf: contract.address?.uf ?? '',
      });

      this.contracts.push(formContract);
    }
  }

  private formatarCep(cep?: string | null): string {
    if (!cep) {
      return '';
    }

    const valor = cep.replace(/\D/g, '').slice(0, 8);

    return valor.length > 5 ? `${valor.slice(0, 5)}-${valor.slice(5)}` : valor;
  }

  adicionarContrato(): void {
    this.contracts.push(this.criarFormContrato());
  }

  private carregarContatos(contatos: ContactResponseDTO[]): void {
    this.contacts.clear();

    for (const contato of contatos) {
      const formContato = this.criarFormContato();

      formContato.patchValue({
        value: contato.value,
        whatsapp: contato.whatsapp,
        primaryContact: contato.primaryContact,
      });

      this.contacts.push(formContato);
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
