import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
//translate

import { OAuthStorage } from 'angular-oauth2-oidc';
import { AppComponent } from './app.component';
// import { DocumentsComponent } from './components/documents/documents.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AccountEndpoint } from './services/account-endpoint.service';
import { AccountService } from './services/account.service';
import { AlertService } from './services/alert.service';
import { AuthStorage } from './services/auth-storage';
import { ConfigurationService } from './services/configuration.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { NotificationService } from './services/notification.service';
import { ThemeManager } from './services/theme-manager';

import { SettingsComponent } from './components/settings/settings.component';

import { SearchBoxComponent } from './components/controls/search-box.component';
import { AppTitleService } from './services/app-title.service';

import { RoleEditorComponent } from './components/controls/role-editor.component';
import { RolesManagementComponent } from './components/controls/roles-management.component';
import { UserInfoComponent } from './components/controls/user-info.component';
import { UserPreferencesComponent } from './components/controls/user-preferences.component';
import { UsersManagementComponent } from './components/controls/users-management.component';
import { BootstrapTabDirective } from './directives/bootstrap-tab.directive';
import { BootstrapToggleDirective } from './directives/bootstrap-toggle.directive';


import { OidcHelperService } from './services/oidc-helper.service';


import { MaterialModule } from './modules/material/material.module';
import { ThirdpartyModule } from './modules/thirdparty/thirdparty.module';
import { SharedcommonModule } from './modules/sharedcommon/sharedcommon.module';
import { ForrootModule } from './modules/forroot/forroot.module';
import { CorecomponentsModule } from './modules/corecomponents/corecomponents.module';
import { DynamicformsModule } from './dynamicforms/dynamicforms.module';
import { PipesModule } from './modules/pipes/pipes.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationPipe } from './pipes/pagination.pipe';
import { PasswordMatchValidatorDirective } from './directives/passwordsmatch.directive';

import { PersonpillComponent } from './components/navbar/personpill/personpill.component';
import { ForgotpasswordComponent } from './components/account/forgotpassword/forgotpassword.component';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent, RegisterConfirmedComponent } from './components/account/register/register.component';
import { ResetpasswordComponent } from './components/account/resetpassword/resetpassword.component';
import { HomeComponent } from './components/home/home.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AppTranslationService } from './services/app-translation.service';
import { GetRowColumnPipe } from './pipes/get-row-column.pipe';
import { CommonModule } from '@angular/common';
import { TemplatePipe } from './pipes/template.pipe';
import { AuthService } from './services/auth.service';
import * as moment from 'moment';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { EndpointBase } from './api/endpoint-base.service';
import { GeocodeModule } from '../geocode/geocode.module';

import { environment } from 'src/environments/environment';
import { API_BASE_URL, Client } from './api/Client';
import { IConfig } from './api/AuthorizedClient';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { AlertdialogComponent } from './components/alertdialog/alertdialog.component';
import { AboutComponent } from './components/about/about.component';
import { ExternalAuthComponent } from './external-auth/external-auth.component';

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [


    AppComponent,

    LoginComponent,
    SettingsComponent,
    UserInfoComponent,
    UsersManagementComponent,
    UserPreferencesComponent,
    RolesManagementComponent,
    RoleEditorComponent,

    SearchBoxComponent,
    BootstrapTabDirective,
    BootstrapToggleDirective,


    //Nav components
    NavbarComponent,





    PaginationPipe,




    RegisterComponent,


    PasswordMatchValidatorDirective,
    RegisterConfirmedComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    PersonpillComponent,
    HomeComponent,

    GetRowColumnPipe,
    TemplatePipe,
    AlertdialogComponent,
    AboutComponent,
    ExternalAuthComponent
  ],
  imports: [
    AppRoutingModule,
    //RouterModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    //common
    SharedcommonModule,
    //core
    CorecomponentsModule,
    //material
    MaterialModule,
    //3rd party module
    ThirdpartyModule,
    //forroot module
    ForrootModule,
    //pipes
    PipesModule,
    //dynamic
    DynamicformsModule,


    HttpClientModule,

    GeocodeModule,
    SocialLoginModule

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: API_BASE_URL, useValue: environment.baseUrl },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '787041522439-rjkm2864v9mbdogmpajg5so80gdq56jk.apps.googleusercontent.com', {
              scopes: 'email',
              // plugin_name: 'the name of the Google OAuth project you created'
            }
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig
    },

    { provide: OAuthStorage, useClass: AuthStorage },
    HttpClientModule,
    NotificationService,
    NotificationEndpoint,
    LocalStoreManager,
    ConfigurationService,
    ThemeManager,
    AccountService,
    AccountEndpoint,
    AlertService,
    AppTitleService,
    OidcHelperService,
    AuthService,
    IConfig,
    EndpointBase,
    Client,
    AppTranslationService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




