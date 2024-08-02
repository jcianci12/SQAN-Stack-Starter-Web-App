import { KeyValue } from '@angular/common';
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, ValidatorFn, ValidationErrors, AbstractControl, ControlContainer } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RegisterViewModel, Client } from 'src/app/api/Client';
import { AlertService } from 'src/app/services/alert.service';
import { fadeInOut } from 'src/app/services/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [fadeInOut]
})
export class RegisterComponent implements OnInit {
  response:  Array<KeyValue<string, any>> | undefined
  minimumPasswordLength = 6

  nameFormGroup!: UntypedFormGroup;

  contactDetailsFormGroup!: UntypedFormGroup;

  DetailsFormGroup!: UntypedFormGroup;


  emailFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.email,
  ]);

  /* Shorthands for form controls (used from within template) */
  get firstName() { return this.nameFormGroup.get('firstName') }
  get surname() { return this.nameFormGroup.get('surname') }
  get positionDescription() { return this.contactDetailsFormGroup.get('positionDescription') }
  get workPhone() { return this.contactDetailsFormGroup.get('workPhone') }

  get email() { return this.contactDetailsFormGroup.get('email') }

  get desiredAccountUserName() { return this.DetailsFormGroup.get('desiredAccountUserName') }


  get password() { return this.DetailsFormGroup.get('password'); }
  get password2() { return this.DetailsFormGroup.get('passwordConfirm'); }

  constructor(private _formBuilder: UntypedFormBuilder, public Client: Client, public _matdialod: MatDialog, public _matsnackbar: MatSnackBar, public alertService: AlertService
  ) { }

  ngOnInit() {
    this.nameFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required],

    });

    this.contactDetailsFormGroup = this._formBuilder.group({
      positionDescription: ['', Validators.required],
      workPhone: ['', Validators.required],
      email: this.emailFormControl
    });

    this.DetailsFormGroup = this._formBuilder.group({
      desiredAccountUserName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(this.minimumPasswordLength)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(this.minimumPasswordLength)]]

    }

    );



    this.DetailsFormGroup.valueChanges.subscribe(changes => {

      const matches = this.password!.value !== this.password2!.value
      console.log('matches', matches)
      if (matches) {
        this.password2!.setErrors({ 'passworddoesntmatch': true });
      }
      else {
        this.password2!.setErrors(null);

      }
    })
  }

  register() {
    let user = new RegisterViewModel({
      email: this.email!.value,
      userName: this.desiredAccountUserName!.value,
      newPassword: this.password!.value,
      fullName: this.firstName!.value + " " + this.surname!.value,
      jobTitle: this.positionDescription!.value,
      phoneNumber: this.workPhone!.value,


    })
    this.Client.register(user).subscribe(r => {
      this._matdialod.open(RegisterConfirmedComponent), {
        data: r
      }
    }, (e) => {
      console.log(e)

      let r = JSON.parse(  e.response)
      this.response = r



      console.log(this.response);
      // this.response.forEach(r => {
      //   console.log(r.descriptor, r.error)
      //   this.alertService.showMessage(r.error)


      // });



    })
  }

  autofill() {
    this.email!.setValue("test.test@health.qld.gov.au")

    this.desiredAccountUserName!.setValue("testing")
    this.password!.setValue("Testing12$")
    this.firstName!.setValue("test")
    this.surname!.setValue("test")
    this.positionDescription!.setValue("test")
    this.workPhone!.setValue("0421453444")

    this.register();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'registerconfirmed.html',
  styleUrls: ['./register.component.scss'],

})
export class RegisterConfirmedComponent {

  constructor(
    public dialogRef: MatDialogRef<RegisterConfirmedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegisterViewModel, private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  navtologinandclosedialog() {
    this.router.navigateByUrl("/login")
    this.dialogRef.close();
  }

}

export interface test {
  field:string,
  errors:string[]
}
