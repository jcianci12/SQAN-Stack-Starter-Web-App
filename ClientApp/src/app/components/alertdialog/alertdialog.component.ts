import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alertdialog',
  templateUrl: './alertdialog.component.html',
  styleUrls: ['./alertdialog.component.scss']
})
export class AlertdialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AlertdialogComponent>
  ) {}

  onOkClick(): void {
    if (this.data.okCallback) {
      this.data.okCallback();
    }
    this.dialogRef.close('ok');
  }

  onCancelClick(): void {
    if (this.data.cancelCallback) {
      this.data.cancelCallback();
    }
    this.dialogRef.close('cancel');
  }

}