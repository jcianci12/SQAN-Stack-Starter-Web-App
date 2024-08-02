import { QuestionBase } from './question-base';

export class DropdownQuestion extends QuestionBase<string> {
  controlType = 'dropdown';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}

export class DropdownQuestionSex extends QuestionBase<string> {
  controlType = 'dropdownsex';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
export class DropdownQuestionIndigenousStatus extends QuestionBase<string> {
  controlType = 'dropdownindigenousstatus';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
export class DropdownQuestionMedicalAtRisk extends QuestionBase<string> {
  controlType = 'dropdownmedicalatrisk';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
export class DropdownQuestionOverseasBorn extends QuestionBase<string> {
  controlType = 'dropdownoverseasborn';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
export class DropdownQuestionRefugee extends QuestionBase<string> {
  controlType = 'dropdownrefugee';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
export class DropdownQuestionPrematurity extends QuestionBase<string> {
  controlType = 'dropdownprematurity';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}