import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaterangeComponent } from './daterange.component';
import { MaterialModule } from '../../../modules/material/material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [DaterangeComponent],
  imports: [
    CommonModule,MaterialModule,FormsModule
  ],
  exports:[DaterangeComponent]
})
export class DaterangeModule { }
