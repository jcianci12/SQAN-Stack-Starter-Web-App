import { QuestionBase } from './question-base';

export class TimeSpanQuestion extends QuestionBase<string> {
  override controlType = 'timespan';

  constructor(options: {} = {}) {
    super(options);
  }
}
