import { Component, OnInit, Input } from '@angular/core';
import {  UntypedFormGroup } from '@angular/forms';
import { QuestionBase } from 'src/app/dynamicforms/fieldclasses/question-base';

@Component({
  selector: 'app-textinput',
  templateUrl: './textinput.component.html',
  styleUrls: ['./textinput.component.scss']
})

//[formControlName]="question.key" [placeholder]=question.label [pattern]=question.regex



export class TextinputComponent implements OnInit {
  @Input() form!: UntypedFormGroup ;
  @Input() question!: QuestionBase<any> ;
  @Input() required!:Boolean


  constructor() { }

  ngOnInit() {
  }

}
