import { QuestionBase } from './question-base';




export class AutoCompletePerson extends QuestionBase<string>   {
  override controlType = 'persondropdown';
  type: string;

  constructor(options: any = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
export class AutoCompleteFacility extends QuestionBase<string>   {
  override controlType = 'facilitydropdown';
  type: string;

  constructor(options: any = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
export class AutoCompleteDisease extends QuestionBase<string>   {
  override controlType = 'diseasedropdown';
  type: string;
  

  constructor(options: any = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}