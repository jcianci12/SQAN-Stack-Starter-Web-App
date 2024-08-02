import { QuestionBase } from './question-base';


export class DecimalQuestion extends QuestionBase<string> {
  override controlType = 'decimal';
  type: number;
  step: number;
  constructor(options: any = {}) {
    super(options);
    this.type = options['type'] || '';
    this.step = options['step'] || '';
  }
}

