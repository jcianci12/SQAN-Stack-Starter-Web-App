import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {
  // <!-- <input matInput [formControlName]="question.key" [matDatepicker]="picker" [placeholder]=question.label>
  // <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  // <mat-datepicker #picker></mat-datepicker> -->

@Input() formControlName: any;
 @Input() question: any
@Input() form: any
@Input() required: any;
  constructor() { }

  ngOnInit() {
  }

}
