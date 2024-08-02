import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DecimalQuestion } from '../../../fieldclasses/DecimalQuestion';

@Component({
  selector: 'app-decimalinput',
  templateUrl: './decimalinput.component.html',
  styleUrls: ['./decimalinput.component.scss']
})
export class DecimalinputComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() question: any;
  @Input() required!:Boolean

  constructor() { }

  ngOnInit(): void {
  }

}
