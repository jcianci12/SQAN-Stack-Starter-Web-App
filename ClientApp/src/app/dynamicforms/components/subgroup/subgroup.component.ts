import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { QuestionBase } from '../../fieldclasses/question-base';
import { HttpClient } from '@angular/common/http';
import { QuestionControlService } from '../../fieldclasses/question-control.service';
import { DynamicFormQuestionComponent } from '../../masterquestioncomponent/dynamic-form-question.component';
import { FormserviceService } from '../../formservice.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-subgroup',
  templateUrl: './subgroup.component.html',
  styleUrls: ['./subgroup.component.css']
})
export class SubgroupComponent implements OnInit {
  // @Input() formsuccess: any;
  // @Output() formsuccessChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() questions: QuestionBase<any>[] = [];
  // @Input() contact: Contact;
  @Input() editmode!: Boolean;
  @Input() formname!: string;
  @Input() contactexists!: Promise<Boolean>;
  @Input() subGroupTitle!: string

  @Input() form!: UntypedFormGroup;
  @Output() formChange = new EventEmitter<UntypedFormGroup>();
  Client!: HttpClient


  payLoad: any;
  //contactexists: Promise<Boolean>;
  saving: boolean = false;
  constructor(private qcs: QuestionControlService, private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DynamicFormQuestionComponent>,
    private fs: FormserviceService
  ) {
    //console.log("Inside Dynamic form")
    //console.log(" this questions is:")
  }

  ngOnChanges(): void {
    //console.log(this.questions)
    this.form = this.qcs.toFormGroup(this.questions);
    this.handleformchange()
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }


  ngOnInit() {
    //console.log("dynamic form data is:")
    //console.log(this.form)
    this.saving = false
    //this.form = this.qcs.toFormGroup(this.questions);
    ////console.log("this contact is")
    // //console.log(this.contact)
    //if (this.contact.personID) {

    // this.form.addControl("ID", new FormControl(this.contact.iD))

    // this.mapvaluestoinitialise()
    //}

    ////console.log(this.form.value)
    //this.handleformchange()
  }

  handleformchange() {
    //console.log(this.form)

    this.form.valueChanges.subscribe(val => {
      console.log(this.form.value)
      this.fs.updateForm(this.form)

    })

  }



}
