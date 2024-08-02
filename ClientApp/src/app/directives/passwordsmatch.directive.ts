import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[apppasswordtomatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchValidatorDirective, multi: true }]
})
export class PasswordMatchValidatorDirective implements Validator {
  @Input('password') password!: string;
  @Input('password2') password2!: string;

  validate(control: AbstractControl): { [key: string]: any} | null
    {
      const matches = this.password == this.password2;
      console.log(this.password,this.password2)
      console.log("Matches", matches)
      return matches ? { doesntmatch: { value: control.value } } : null;  }
}


