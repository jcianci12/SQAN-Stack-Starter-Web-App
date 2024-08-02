import { QuestionBase } from './question-base';

export class Datepicker extends QuestionBase<string>{
    override controlType = 'datepicker';
    type: string;
    constructor(options: any = {}) {
        super(options);
        this.type = options['type'] || '';
      }
}
