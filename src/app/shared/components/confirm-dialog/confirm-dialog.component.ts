  import { Component, inject } from '@angular/core';
  import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { ConfirmDialogData } from '../../dto/confirm-dialog-data.dto';

  @Component({
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    standalone: true,
    selector: 'app-confirm-dialog',
    styleUrl: './confirm-dialog.component.scss',
    templateUrl: './confirm-dialog.component.html',
  })
  export class ConfirmDialogComponent {
    private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

    readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

    cancelar(): void {
      this.dialogRef.close(false);
    }

    confirmar(): void {
      this.dialogRef.close(true);
    }
  }
