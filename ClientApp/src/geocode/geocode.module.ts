import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeocoderinputComponent } from '../app/components/controls/geocoderinput/geocoderinput.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MaterialModule } from '../app/modules/material/material.module';



@NgModule({
  declarations: [GeocoderinputComponent],
  imports: [
    CommonModule,    GooglePlaceModule,MaterialModule

  ],exports:[GeocoderinputComponent]
})
export class GeocodeModule { }
