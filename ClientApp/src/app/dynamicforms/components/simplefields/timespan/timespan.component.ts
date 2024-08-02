import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, Form, UntypedFormControl, UntypedFormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-timespan',
  templateUrl: './timespan.component.html',
  styleUrls: ['./timespan.component.scss']
})
export class TimespanComponent implements OnInit {
  @Input() public form!: UntypedFormGroup;
  @Input() question:any;
  @Input() required!: Boolean


  disabled: any
  hours!: number

  durationString: any
  myControl!: AbstractControl;

  matcher!: ErrorStateMatcher
  constructor() {

  }

  ngOnInit(): void {
    this.myControl = this.form.controls[this.question.key]
    this.matcher = new MyErrorStateMatcher()
    //set the string on init if there is a value
    //check the value
  }


}

/** Error when invalid control is dirty or touched*/
export class MyErrorStateMatcher implements ErrorStateMatcher {

  constructor() {

  }

  minislargerthanmax(){

  }

  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (control == null || form == null) {
      return false;
    }

    let min = parseInt(form!.form.get('minimumHirePeriodInHours')!.value);
    let max = parseInt(form!.form.get('maximumHirePeriodInHours')!.value);
    let v = !!(
      control &&
      (control.invalid ||
        min > max ||
        min == 0 ||
        max == 0 ||
        min == null ||
        max == null ||
        isNaN(min) ||
        isNaN(max)) &&
      (control.dirty || control.touched)
    );
    // if (v == true) {
    //   form.form.controls['minimumHirePeriodInHours'].setErrors({ 'incorrect': true },{emitEvent:false})
    //   form.form.controls['maximumHirePeriodInHours'].setErrors({ 'incorrect': true },{emitEvent:false})

    // }
    // else{
    //   form.form.controls['minimumHirePeriodInHours'].setErrors(null,{emitEvent:false})
    //   form.form.controls['maximumHirePeriodInHours'].setErrors(null,{emitEvent:false})
    //  }
    //console.log("error returning:", v, min, max, min, max)
    return v;


  }
}



