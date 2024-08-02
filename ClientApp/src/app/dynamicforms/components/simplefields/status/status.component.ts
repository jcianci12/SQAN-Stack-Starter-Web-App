import { Component, OnInit, Input } from '@angular/core';
import { EpisodeStatus } from "../../../models/EpisodeStatus";
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { stat } from 'fs';
import { debounceTime } from 'rxjs/operators';
import { fieldMatchesOptions } from '../../../../functions/fieldMatchesOptions';
import { valueInTextBoxButNoValueInHiddenField } from '../../../../functions/valueInTextBoxButNoValueInHiddenField';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  //      <app-status [question]=question [form]=form></app-status>
  @Input() question: EpisodeStatus;
  @Input() form;
  myControl: AbstractControl;
  hiddenfield: AbstractControl;


  color = 'accent';
  checked :boolean;
  disabled = false;

  constructor() { }

  ngOnInit() {
    this.myControl = this.form.controls[this.question.key]

    this.hiddenfield = this.addhiddenfield()
    this.syncSwitchToValue()
    this.syncValueToSwitch()
  }
  syncSwitchToValue() {
    //this.question.value = (   this.question.value==1?0:1)
    //this.myControl.setValue(this.question.value=="1"?"0":"1")
    this.hiddenfield.setValue(this.checked?0:1)
  }

  syncValueToSwitch() {
    console.log(this.question.value)
    if (this.question.value == "1") {
      this.myControl.setValue(1);
    }
    else {
      this.myControl.setValue(0);
    }
  }
  addhiddenfield() {
    this.form.addControl(this.question.hiddenfield, new UntypedFormControl(this.myControl.value, null));
    return this.form.controls[this.question.hiddenfield]
  }
  
  
}
