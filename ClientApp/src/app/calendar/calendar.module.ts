import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { MaterialModule } from '../modules/material/material.module';
import { CalendarModule } from 'angular-calendar';



@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,MaterialModule,CalendarModule
  ],exports:[CalendarComponent]
})
export class CalendarSharedModule { }
