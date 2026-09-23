import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { FormError } from '@supremenetwork/ui';
import { ContactDirective } from '../../directives/contact.directive';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormError,
    ContactDirective,
    MatCheckboxModule,
  ],
  standalone: true,
  selector: 'app-contact-form',
  styleUrl: './contact-form.component.scss',
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent {
  @Input({ required: true })
  form!: FormGroup;

  @Input()
  index!: number;

  @Output()
  removerContato = new EventEmitter<void>();

  @Output() primaryChanged = new EventEmitter<boolean>();

  remover(): void {
    this.removerContato.emit();
  }

  alterPrincipal(event: MatCheckboxChange): void {
    this.form.controls['primaryContact'].setValue(event.checked);
  }
}
