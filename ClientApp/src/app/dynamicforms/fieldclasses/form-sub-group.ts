import { QuestionBase } from './question-base';

export class FormSubGroup extends QuestionBase<string> {
    FormGroupTitle: String;
    controlType = 'formsubgroup';
    questions: Array<  QuestionBase<string>>;
    type:string
    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
      }
}
