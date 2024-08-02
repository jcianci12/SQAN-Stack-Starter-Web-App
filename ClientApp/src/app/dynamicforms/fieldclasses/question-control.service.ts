import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase<any>[]) {
    let group: any = {};

    questions.forEach(question => {

      let fc = new UntypedFormControl(question.value)
      
      fc.setValue(question.value)

      //       if (question.regex) {
      //         question.validators.forEach(element => {
      //           console.log(element)
      // fc.setValidators(element)
      //         });
      //       }
      if (question.regex) {
        console.log("the regexp is:")
        console.log(question.regex)
        fc.setValidators(Validators.pattern(question.regex))
      }

      if (question.required) {
        fc.setValidators(Validators.required)
      }
console.log(question)
      if (question.formSubGroup) {
        console.log(question.formSubGroup);
        console.log("control is:")

        let newGroup = this.toFormGroup(question.formSubGroup);
       // group[question.key] = newGroup;
     // group[question.formGroupName] = question.formGroupName;
        console.log(group[question.key])
      }


      group[question.key] = fc;

      // question.required ? new FormControl(question.value || '', Validators.required)
      //                                         : new FormControl(question.value || '');
    });

    let fg = new UntypedFormGroup(group);
    //console.log("the form data is:")
    //console.log(fg);
    return fg;
  }
}