import { TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [TitleCasePipe, CdkDrag, MatButtonModule, MatIconModule],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.scss',
})
export class DragAndDropComponent {
  title = input('');
  closedDialog = output<void>();

  closeDialog(): void {
    this.closedDialog.emit();
  }
}
