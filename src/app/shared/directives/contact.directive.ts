import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appContact]',
  standalone: true,
})
export class ContactDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly renderer = inject(Renderer2);
  private readonly ngControl = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value;

    if (!valor) {
      this.atualizarValor('');
      return;
    }

    if (this.ehTextoOuEmail(valor)) {
      this.atualizarValor(valor);
      return;
    }

    this.atualizarValor(this.formatarTelefone(valor));
  }

  private ehTextoOuEmail(valor: string): boolean {
    return valor.includes('@') || /^[a-zA-Z]/.test(valor);
  }

  private formatarTelefone(valor: string): string {
    const numero = valor.replace(/\D/g, '').slice(0, 11);

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

  private atualizarValor(valor: string): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', valor);

    this.ngControl.control?.setValue(valor, {
      emitEvent: true,
    });
  }
}
