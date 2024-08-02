import { Component, OnInit, Input, Output } from '@angular/core';
import { QuestionControlService } from '../fieldclasses/question-control.service';
import { QuestionBase } from '../fieldclasses/question-base';
import { UntypedFormGroup, AbstractControl, UntypedFormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { DynamicFormQuestionComponent } from '../masterquestioncomponent/dynamic-form-question.component';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FormserviceService } from '../formservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-dynamic-form',
  styleUrls: ['./dynamic-form.styles.css'],
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {

  // @Input() formsuccess: any;
  // @Output() formsuccessChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() questions: QuestionBase<any>[] = [];
  // @Input() contact: Contact;
  @Input() editmode!: Boolean;
  @Input() formname!: string;
  @Input() contactexists!: Promise<Boolean>;

  @Input() form!: UntypedFormGroup;
  @Output() formChange = new EventEmitter<UntypedFormGroup>();
  @Output() formSave = new EventEmitter();
  Client!: HttpClient


  payLoad: any;
  //contactexists: Promise<Boolean>;
  saving: boolean = false;
  constructor(private qcs: QuestionControlService,
     private fs: FormserviceService
  ) {
    //console.log("Inside Dynamic form")
    //console.log(" this questions is:")


  }

  ngOnChanges(): void {
    //console.log(this.questions)
    this.form = this.qcs.toFormGroup(this.questions);
    //this.handleformchange()
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }


  ngOnInit() {
    this.form.valueChanges
    .pipe(

    )
    .subscribe(val => {
      //console.log("test")
      this.formChange.emit(this.form)
    })
    this.saving = false
    this.fs.currentFormData.subscribe(i => {


      //console.log(i, this.form)

      Object.keys(i).forEach((key) => {
       // console.log(key, i[key])
        this.form.removeControl(key);
        this.form.addControl(key, new UntypedFormControl(key.toString()))

      })

    })
  }

  handleformchange() {
    //console.log(this.form)



  }

  onSubmit() {
    this.saving = true
    this.formSave.emit(this.form.value)
    ////console.log(this.contact)
    this.saving = false

    //this.save()
  }


}
