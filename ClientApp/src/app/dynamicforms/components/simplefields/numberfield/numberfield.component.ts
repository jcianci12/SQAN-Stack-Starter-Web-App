import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { QuestionBase } from '../../../fieldclasses/question-base';

@Component({
  selector: 'app-numberfield',
  templateUrl: './numberfield.component.html',
  styleUrls: ['./numberfield.component.scss']
})
export class NumberfieldComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() question!: QuestionBase<any>;

  constructor() { }

  ngOnInit() {
  }
}
