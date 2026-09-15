import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function documentValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor) {
      return null;
    }

    const documento = valor.replace(/\D/g, '');

    if (documento.length === 11) {
      return validarCpf(documento) ? null : { invalidDocument: true };
    }

    if (documento.length === 14) {
      return validarCnpj(documento) ? null : { invalidDocument: true };
    }

    return { invalidDocument: true };
  };
}

function validarCpf(cpf: string): boolean {
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let resto = (soma * 10) % 11;

  if (resto === 10) {
    resto = 0;
  }

  if (resto !== Number(cpf[9])) {
    return false;
  }

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10) {
    resto = 0;
  }

  return resto === Number(cpf[10]);
}

function validarCnpj(cnpj: string): boolean {
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  const calcularDigito = (valor: string): number => {
    let peso = valor.length - 7;
    let soma = 0;

    for (const numero of valor) {
      soma += Number(numero) * peso;

      peso--;

      if (peso === 1) {
        peso = 9;
      }
    }

    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiroDigito = calcularDigito(cnpj.substring(0, 12));

  if (primeiroDigito !== Number(cnpj[12])) {
    return false;
  }

  const segundoDigito = calcularDigito(cnpj.substring(0, 13));

  return segundoDigito === Number(cnpj[13]);
}
