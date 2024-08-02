import { QuestionBase } from './question-base';
export class NumberTextboxQuestion extends QuestionBase<string> {
  override controlType = 'numbertextbox';
  type: number;
  constructor(options: any = {}) {
    super(options);
    this.type = options['type'] || '';
    this.regex = new RegExp("[0-9]*")
  }
}
