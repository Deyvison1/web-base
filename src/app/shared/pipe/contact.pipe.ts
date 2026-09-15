import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contact',
  standalone: true,
})
export class ContactPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    if (this.ehTextoOuEmail(value)) {
      return value;
    }

    return this.formatarTelefone(value);
  }

  private ehTextoOuEmail(value: string): boolean {
    return value.includes('@') || /^[a-zA-Z]/.test(value);
  }

  private formatarTelefone(value: string): string {
    const numero = value.replace(/\D/g, '').slice(0, 11);

    if (numero.length <= 2) {
      return numero;
    }

    if (numero.length <= 6) {
      return `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
    }

    if (numero.length <= 10) {
      return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`;
    }

    return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
  }
}
