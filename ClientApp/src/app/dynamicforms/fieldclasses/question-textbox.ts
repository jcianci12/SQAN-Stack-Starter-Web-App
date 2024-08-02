import { QuestionBase } from './question-base';
import { Validators, PatternValidator } from '@angular/forms';

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  type: string;
hidden:boolean;
//regex:string;
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
