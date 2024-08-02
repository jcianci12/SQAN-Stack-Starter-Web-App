import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatePickerComponent } from 'src/app/dynamicforms/components/simplefields/date-picker/date-picker.component';
import { HiddenfieldComponent } from 'src/app/dynamicforms/components/simplefields/hiddenfield/hiddenfield.component';
import { NumberfieldComponent } from 'src/app/dynamicforms/components/simplefields/numberfield/numberfield.component';
import { TextinputComponent } from 'src/app/dynamicforms/components/simplefields/textinput/textinput.component';
import { SubgroupComponent } from 'src/app/dynamicforms/components/subgroup/subgroup.component';
import { WysiwygfieldComponent } from 'src/app/dynamicforms/components/wysiwygfield/wysiwygfield.component';
import { MaterialModule } from '../modules/material/material.module';
import { SharedcommonModule } from '../modules/sharedcommon/sharedcommon.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DynamicFormComponent } from 'src/app/dynamicforms/masterformcomponent/dynamic-form.component';
import { DynamicFormQuestionComponent } from 'src/app/dynamicforms/masterquestioncomponent/dynamic-form-question.component';
import { DecimalinputComponent } from './components/simplefields/decimalinput/decimalinput.component';

import { TimespanComponent } from './components/simplefields/timespan/timespan.component';



@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicFormQuestionComponent,


    //Simple fields
    TextinputComponent,
    NumberfieldComponent,
    WysiwygfieldComponent,
    HiddenfieldComponent,

    //Dropdowns

    //Auto completes
    DatePickerComponent,
    SubgroupComponent,
    SubgroupComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    DecimalinputComponent,




    TimespanComponent,
  ],

  imports: [
    CommonModule,
    MaterialModule,
    SharedcommonModule,
    CKEditorModule
  ],

  exports: [
    DynamicFormComponent,
    DynamicFormQuestionComponent,

    //Simple fields
    TextinputComponent,
    NumberfieldComponent,
    WysiwygfieldComponent,
    HiddenfieldComponent,
    TimespanComponent,

    //Dropdowns

    //Auto completes
    DatePickerComponent,
    SubgroupComponent,
    SubgroupComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,



    CommonModule
  ]
})

export class DynamicformsModule { }
