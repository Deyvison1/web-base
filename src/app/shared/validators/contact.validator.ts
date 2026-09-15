import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const contactValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const valor = control.value?.trim();

  if (!valor) {
    return null;
  }

  if (valor.includes('@')) {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);

    return emailValido ? null : { email: true };
  }

  if (/^[a-zA-Z]/.test(valor)) {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);

    return emailValido ? null : { email: true };
  }

  const telefone = valor.replace(/\D/g, '');

  const telefoneValido = telefone.length === 10 || telefone.length === 11;

  return telefoneValido ? null : { telefone: true };
};
