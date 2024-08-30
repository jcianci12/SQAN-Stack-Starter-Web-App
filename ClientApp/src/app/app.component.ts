

import { Component } from '@angular/core';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { AuthService } from './services/auth.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  appTitle = this.appTitleService.appName;





  gT = (key: string | Array<string>, interpolateParams?: object) => this.translationService.getTranslation(key, interpolateParams);




  constructor(
    storageManager: LocalStoreManager,
    // private toastaService!: ToastaService,
    // private toastaConfig!: ToastaConfig,
    private appTitleService: AppTitleService,
    private translationService: AppTranslationService,
    public configurations: ConfigurationService,
    public authService: AuthService
  ) {

    storageManager.initialiseStorageSyncListener();

    // this.toastaConfig.theme = 'bootstrap';
    // this.toastaConfig.position = 'top-right';
    // this.toastaConfig.limit = 100;
    // this.toastaConfig.showClose = true;
    // this.toastaConfig.showDuration = false;

    this.appTitleService.appName = this.appTitle;
  }



  // onLoginModalShown() {
  //   this.alertService.showStickyMessage('Session Expired', 'Your Session has expired. Please log in again', MessageSeverity.info);
  // }


  // onLoginModalHidden() {
  //   this.alertService.resetStickyMessage();
  //   this.loginControl.reset();
  //   setTimeout(() => {
  //     this.shouldShowLoginModal = false;

  //   }, 100);

  //   if (this.authService.isSessionExpired) {
  //     this.alertService.showStickyMessage('Session Expired', 'Your Session has expired. Please log in again to renew your session', MessageSeverity.warn);
  //   }
  // }














  getYear() {
    return new Date().getUTCFullYear();
  }





}
