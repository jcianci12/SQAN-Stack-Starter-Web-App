import { QuestionBase } from './question-base';
export class YesNoNull extends QuestionBase<string> {
  controlType = 'yesnonull';
  options: {
    key: string;
    value: string;
  }[] = [];
  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
