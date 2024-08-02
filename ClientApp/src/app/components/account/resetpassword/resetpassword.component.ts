import { Component, OnInit } from '@angular/core';
import {  AbstractControl, UntypedFormControl, UntypedFormGroup,   ValidationErrors,    ValidatorFn,    Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordViewModel, Client } from 'src/app/api/Client';
import { Message } from 'src/app/api/Client';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  passwordMinChars = 6

  token!: string
  resetPasswordViewModel!: ResetPasswordViewModel
  form!: UntypedFormGroup
  loading = false
  success!: boolean;


  constructor(
    private route: ActivatedRoute, private Client: Client, public alertService: AlertService
  ) {

  }


  ngOnInit(): void {
    this.gettokenfromRoute()
    this.form = this.createResetForm()
  }

  gettokenfromRoute() {
    this.route.queryParams.subscribe(p => {
      console.log(p)
      this.token = p["token"]
      console.log(this.token)
    })
  }

  submit() {
    console.warn(this.form.value)
    this.loading = true
    let resetPasswordViewModel = new ResetPasswordViewModel();

    resetPasswordViewModel.token = this.token
    resetPasswordViewModel.newPassword = this.getPasswordValue
    resetPasswordViewModel.email = this.getEmailValue
    this.Client.resetpassword(resetPasswordViewModel).subscribe(i => {
      console.log(i);
      this.loading = false
      this.success = false
      if (i.succeeded == true) {
        this.success = true
        this.alertService.showMessage("Password changed successfuly!","OK",MessageSeverity.success)
      }
      else {
        i.errors!.forEach(erroritem => {
          console.log(erroritem)
          this.success = false
          this.alertService.showMessage("Something went wrong!", erroritem.description!, MessageSeverity.error)
        })
      }

    })
  }

  createResetForm() {

    return new UntypedFormGroup({
      emailFormControl: this.createEmailPasswordFormControl(),
      passwordFormControl: this.createNewPasswordFormControl(),
      passwordConfirmFormControl: this.createPasswordConfirmFormControl(),
      tokenFromControl: this.createTokenFormControl()
    }, {
      updateOn: 'change', validators: this.PasswordMatchValidator
    })
  }

  get getEmailFormControl() {
    return this.form.get("emailFormControl")
  }
  get getEmailValue() {
    return this.getEmailFormControl!.value
  }
  get getPasswordFormControl() {
    return this.form.get("passwordFormControl")
  }

  get getPasswordValue() {
    return this.getPasswordFormControl!.value
  }

  get getPasswordConfirmFormControl() {
    return this.form.get("passwordConfirmFormControl")
  }
  get getPasswordConfirmValue() {
    return this.getPasswordConfirmFormControl!.value
  }

  createEmailPasswordFormControl() {
    return new UntypedFormControl("", [Validators.email, Validators.required])
  }
  createNewPasswordFormControl() {
    return new UntypedFormControl("", Validators.required)
  }
  createPasswordConfirmFormControl() {
    return new UntypedFormControl("", Validators.required)
  }
  createTokenFormControl() {
    return new UntypedFormControl(this.token, Validators.required)
  }
  getPasswordValidatorRule() {
    return [Validators.minLength(this.passwordMinChars), Validators.required]
  }


  PasswordMatchValidator: ValidatorFn =  (fg: AbstractControl):ValidationErrors|null=> {
    const start = fg.get('passwordFormControl')!.value;
    const end = fg.get('passwordConfirmFormControl')!.value;

    console.log(start, end);
    let r = start !== null &&  end !== null &&  start == end ? null  : { noMatch: true };
    return r
  };

}








