import { QuestionBase } from './question-base';

export class Checkbox extends QuestionBase<string> {
    override controlType = 'checkbox';
    type: string;
  
    constructor(options: any = {}) {
      super(options);
      this.type = options['type'] || '';
      this.style = options['style'|| '']
    }

}
