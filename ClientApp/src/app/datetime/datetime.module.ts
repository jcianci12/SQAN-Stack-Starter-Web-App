import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatetimeComponent } from '../components/datetime/datetime.component';
import { MaterialModule } from '../modules/material/material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [DatetimeComponent],
  imports: [
    CommonModule,MaterialModule,FormsModule
  ], exports: [DatetimeComponent]
})
export class DatetimeModule { }
