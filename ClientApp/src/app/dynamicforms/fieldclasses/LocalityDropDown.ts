import { QuestionBase } from './question-base';
export class LocalityDropDown extends QuestionBase<string> {
  controlType = 'localitydropdown';
  type: string;
  hiddenfield: string;
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
