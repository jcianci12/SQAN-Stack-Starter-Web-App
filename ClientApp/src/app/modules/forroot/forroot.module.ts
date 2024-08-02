import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLanguageLoader } from 'src/app/services/app-translation.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //Authorisation
    OAuthModule.forRoot(),
    ModalModule.forRoot(),


    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLanguageLoader
      }
    })

  ],exports:[
    CommonModule,
    //Authorisation
    OAuthModule,
    ModalModule,


    TooltipModule,
    PopoverModule,
    BsDropdownModule,
    ModalModule,    TranslateModule

  ]
})
export class ForrootModule { }
