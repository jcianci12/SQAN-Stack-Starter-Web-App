import { Component, Input } from '@angular/core';
import { UntypedFormGroup, FormControl, Form, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { QuestionBase } from '../fieldclasses/question-base';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls:['./dynamic-form-question.styles.css']
})
export class DynamicFormQuestionComponent {
  constructor(private _snackBar: MatSnackBar) { }
  @Input()
  question!: QuestionBase<any>;
  @Input()
  form!: UntypedFormGroup;
  @Input()
  editmode!: Boolean;
  @Input()
  formGroupName!: string;
  @Input()
  required!: Boolean;
  searchterm: string = " ";
  myControl: any;
  selectedkey: any;
  selectedstring: any;
  hiddenfield: any;
  formcontrol!: UntypedFormGroup;
  contactexists!: Boolean;
  filteredOptions!: Promise<any>;
  data: any;

  get isValid() {
     this.form.controls[this.question.key].valid;

    return

  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //console.log("this.form.controls[this.question.key]");

    //console.log(this.question.key);
    //console.log("this.form.controls[this.formGroupName]");

    //console.log(this.form.controls[this.formGroupName]);

         //this.myControl = this.form.controls[this.question.key]

  }

  setselected(value: any) {
    //console.log(value)
    this._snackBar.open("setting selected")

    if (this.form.controls[this.question.hiddenfield]) {
      //console.log("Found field")
      //console.log(this.question.hiddenfield)
      //console.log()
      //console.log("setting value to:")
      //console.log(value)
      this.form.controls[this.question.hiddenfield].setValue(value)
      //this.form.value[this.question.hiddenfield].value = value
      //this.form.controls[this.question.hiddenfield].clearValidators
    }
    this.selectedkey = value

  }


}
