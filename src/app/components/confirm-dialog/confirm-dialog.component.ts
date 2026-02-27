import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  @Input() title!: string;
  @Input() message!: string;
  @Input() confirmButtonText: string = 'Confirm';
  @Input() confrimButtonClass: string = 'btn-primary'
  @Input() cancelButtonText: string = 'Close';

  @Output() response = new EventEmitter<boolean>();

  onConfirm() {
    this.response.emit(true);
  }

  onCancel() {
    this.response.emit(false);
  }
}
