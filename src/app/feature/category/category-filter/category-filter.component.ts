import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CategorySearchRequestDTO } from '../../../shared/dto/request/category-search-request.dto';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  selector: 'app-category-filter',
  styleUrl: './category-filter.component.scss',
  templateUrl: './category-filter.component.html',
})
export class CategoryFilterComponent {
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  searchEvent = output<CategorySearchRequestDTO>();
  clearEvent = output<void>();

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: [''],
      description: [''],
    });
  }

  clear(): void {
    this.form.reset();
    this.clearEvent.emit();
  }

  search(): void {
    this.searchEvent.emit(this.form.value);
  }
}
