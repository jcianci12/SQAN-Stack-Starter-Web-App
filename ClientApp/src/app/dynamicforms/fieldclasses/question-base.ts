import { Validators, PatternValidator } from '@angular/forms';

export class QuestionBase<T> {
  value: T|undefined;
  key: string;
  formGroupName: string;
  columnCount: string | undefined;

  label: string;
  required: boolean;
  order: number;
  controlType: string;
  hiddenfield: string;
  showfield:boolean | undefined;
  regex: RegExp;
  header: boolean|null;
  formSubGroup: Array<QuestionBase<T>>|null;
  style:string;
  constructor(options: {
    value?: T,
    key?: string,
    formGroupName?: string,
    columnCount?: string,


    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    hiddenfield?: string,
    data?: any,
    regex?: RegExp|undefined,
    header?: boolean,

    formSubGroup?: Array<QuestionBase<T>>,
style? :string

  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.formGroupName = options.formGroupName || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.hiddenfield = options.hiddenfield || '';
    this.regex = options.regex! || null;
    this.header = options.header || null;
    this.style = options.style || 'col-12';
    this.formSubGroup = options.formSubGroup || null;
  }
}
