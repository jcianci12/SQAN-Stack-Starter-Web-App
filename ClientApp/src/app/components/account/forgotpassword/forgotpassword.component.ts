import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForgotPasswordViewModel, Client } from 'src/app/api/Client';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  constructor(private _http: Client, public dialog: MatDialog) { }

  emailFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.email,
  ]);
  fpvm: ForgotPasswordViewModel = new ForgotPasswordViewModel()
  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.emailFormControl.setValue("");
  }

  submit() {
    const dialogRef = this.dialog.open(ForgotPasswordConfirmationDialogue, {
      width: '250px',
      data: { email: this.emailFormControl.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
    console.log("FC", this.emailFormControl)
    console.log("FC value", this.emailFormControl.value)
    this.fpvm.email = this.emailFormControl.value
    this._http.forgotpassword(this.fpvm).subscribe(r => {

    })

  }

  invalid(fc: UntypedFormControl): boolean {
    return fc.hasError('email') && !fc.hasError('required')
  }
  required(fc: UntypedFormControl): boolean {
    return fc.hasError('required')
  }


}

@Component({
  selector: 'forgotpasswordcomplete-dialog',
  templateUrl: 'forgotpasswordcomplete.html',
})
export class ForgotPasswordConfirmationDialogue {

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordConfirmationDialogue>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  email: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
