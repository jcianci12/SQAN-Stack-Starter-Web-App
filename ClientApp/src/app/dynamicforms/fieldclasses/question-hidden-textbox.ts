import { QuestionBase } from './question-base';

export class HiddenTextboxQuestion extends QuestionBase<string> {
  override controlType = 'hiddentextbox';
  type: string;
hidden:boolean | undefined;

  constructor(options: any) {
    super(options);
    this.type = options['type'] || '';
  }
}