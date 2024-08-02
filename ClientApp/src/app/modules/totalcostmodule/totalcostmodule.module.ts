import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalcostexludingdeliveryComponent } from 'src/app/components/totalcostexludingdelivery/totalcostexludingdelivery.component';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [TotalcostexludingdeliveryComponent],
  imports: [
    CommonModule, PipesModule
  ],
  exports:[TotalcostexludingdeliveryComponent]
})
export class TotalcostmoduleModule { }
