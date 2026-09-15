import { ChangeDetectorRef, Component, DestroyRef, inject, input, OnInit } from '@angular/core';

import { AbstractControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form-error',
  standalone: true,
  templateUrl: './form-error.component.html',
})
export class FormErrorComponent implements OnInit {
  control = input.required<AbstractControl>();

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  mensagem: string | null = null;

  ngOnInit(): void {
    const control = this.control();

    this.atualizarMensagem();

    control.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.atualizarMensagem();
      this.cdr.markForCheck();
    });

    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.atualizarMensagem();
      this.cdr.markForCheck();
    });
  }

  private atualizarMensagem(): void {
    const control = this.control();

    if (!control.touched || !control.errors) {
      this.mensagem = null;
      return;
    }

    if (control.hasError('required')) {
      this.mensagem = 'Campo obrigatório.';
      return;
    }

    if (control.hasError('invalidDocument')) {
      this.mensagem = 'CPF ou CNPJ inválido.';
      return;
    }

    if (control.hasError('invalidName')) {
      this.mensagem = 'Nome inválido.';
      return;
    }

    if (control.hasError('invalidDate')) {
      this.mensagem = 'Data inválida.';
      return;
    }

    if (control.hasError('dateBeforeToday')) {
      this.mensagem = 'A data deve ser anterior à data atual.';
      return;
    }

    if (control.hasError('email')) {
      this.mensagem = 'Informe um e-mail válido.';
      return;
    }

    if (control.hasError('multiplePrimaryContacts')) {
      this.mensagem = 'So e possivel marcar um contato como principal.';
      return;
    }

    if (control.hasError('telefone')) {
      this.mensagem = 'Informe um telefone válido.';
      return;
    }

    this.mensagem = null;
  }
}
