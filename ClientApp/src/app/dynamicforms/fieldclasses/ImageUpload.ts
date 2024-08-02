import { QuestionBase } from './question-base';


export class ImageUpload extends QuestionBase<string> {
  override controlType = 'imageupload';
  maximagesize:number;
  maximagecount:number;
  constructor(options: any = {}) {
    super(options);
   this.maximagesize = options['maximagesize'] || 512;//kb
   this.maximagecount = options['maximagecount'] || 3

  }
}
