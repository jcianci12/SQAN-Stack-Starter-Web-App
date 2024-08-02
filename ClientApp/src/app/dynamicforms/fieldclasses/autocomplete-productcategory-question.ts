import { QuestionBase } from './question-base';

export class AutocompleteProductCategoryQuestion extends QuestionBase<string> {  
    type: string;

    constructor(options: any = {}) {
      super(options);
      this.type = options['type'] || '';
      this.controlType = 'autocompleteproductcategory';
    }
}
