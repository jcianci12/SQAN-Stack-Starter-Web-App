import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { QuestionBase } from '../../../fieldclasses/question-base';

@Component({
  selector: 'app-hiddenfield',
  templateUrl: './hiddenfield.component.html',
  styleUrls: ['./hiddenfield.component.scss']
})
export class HiddenfieldComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() question!: QuestionBase<any>;


  constructor() { }

  ngOnInit() {
  }

}
