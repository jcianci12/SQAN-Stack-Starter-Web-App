import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxFileDropModule } from 'ngx-file-drop';
import { OrderModule } from 'ngx-order-pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //Installed modules
    NgxFileDropModule,
    NgxSpinnerModule,
    OrderModule,
    NgxFileDropModule,
    // NgxDatatableModule,

    NgSelectModule,
    FontAwesomeModule,TabsModule.forRoot()

  ],
  exports:[
    //Installed modules
    NgxFileDropModule,
    NgxSpinnerModule,
    OrderModule,
    NgxFileDropModule,
    // NgxDatatableModule,
    NgSelectModule,
    FontAwesomeModule,TabsModule


  ]
})
export class ThirdpartyModule { }
