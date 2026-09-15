import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appCpfCnpj]',
  standalone: true,
})
export class CpfCnpjDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  private readonly ngControl = inject(NgControl);

  private readonly renderer = inject(Renderer2);

  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.ngControl.valueChanges?.subscribe((valor) => {
      const formatado = this.formatarCpfCnpj(valor ?? '');

      if (this.elementRef.nativeElement.value !== formatado) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', formatado);
      }
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    const formatado = this.formatarCpfCnpj(input.value);

    if (input.value === formatado) {
      return;
    }

    this.renderer.setProperty(input, 'value', formatado);

    this.ngControl.control?.setValue(formatado);
  }

  private formatarCpfCnpj(valor: string): string {
    const documento = valor.replace(/\D/g, '').substring(0, 14);

    if (documento.length <= 11) {
      return this.formatarCpf(documento);
    }

    return this.formatarCnpj(documento);
  }

  private formatarCpf(cpf: string): string {
    if (cpf.length > 9) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }

    if (cpf.length > 6) {
      return cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    }

    if (cpf.length > 3) {
      return cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    return cpf;
  }

  private formatarCnpj(cnpj: string): string {
    if (cnpj.length > 12) {
      return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
    }

    if (cnpj.length > 8) {
      return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4');
    }

    if (cnpj.length > 5) {
      return cnpj.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
    }

    if (cnpj.length > 2) {
      return cnpj.replace(/(\d{2})(\d{1,3})/, '$1.$2');
    }

    return cnpj;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
