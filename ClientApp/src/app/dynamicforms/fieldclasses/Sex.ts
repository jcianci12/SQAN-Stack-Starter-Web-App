import { QuestionBase } from './question-base';
export class Sex extends QuestionBase<string> {
  controlType = 'sex';
  options: {
    key: string;
    value: string;
  }[] = [];
  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
