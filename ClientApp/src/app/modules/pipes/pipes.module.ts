import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupByPipe } from 'src/app/pipes/group-by.pipe';
import { TrimPipe } from 'src/app/pipes/trimstring.pipe';
import { MomentdateisbeforeorafterPipe } from '../../pipes/momentdateisbeforeorafter.pipe';
import { TotalPipe } from '../../pipes/total.pipe';
import { StarttimeisbeforeendtimePipe } from '../../starttimeisbeforeendtime.pipe';



@NgModule({
  declarations: [
    //Pipes
    GroupByPipe,
    TrimPipe,
    StarttimeisbeforeendtimePipe, 
    TotalPipe, 
    MomentdateisbeforeorafterPipe, 


  ],
  imports: [
    CommonModule,

  ],
  exports: [
    //Pipes
    GroupByPipe,
    TrimPipe,
    StarttimeisbeforeendtimePipe, 
    TotalPipe, 
    MomentdateisbeforeorafterPipe, 

  ]
})
export class PipesModule { }
