import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCep]',
  standalone: true,
})
export class CepDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly renderer = inject(Renderer2);
  private readonly ngControl = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 8);

    const formatted = value.length > 5 ? `${value.slice(0, 5)}-${value.slice(5)}` : value;

    this.renderer.setProperty(this.elementRef.nativeElement, 'value', formatted);

    this.ngControl.control?.setValue(formatted, {
      emitEvent: true,
    });
  }
}
