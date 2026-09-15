import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export const nameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = control.value?.trim();

  if (!valor) {
    return null;
  }

  const nomes: string[] = valor.split(/\s+/);

  if (nomes.length < 2) {
    return { invalidName: true };
  }

  const nomesValidos = nomes.every((nome: string) => /^[a-zA-ZÀ-ÿ]+$/.test(nome));

  if (!nomesValidos) {
    return { invalidName: true };
  }

  return null;
};
