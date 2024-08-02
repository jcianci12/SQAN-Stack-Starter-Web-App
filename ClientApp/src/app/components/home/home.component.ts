

import { Component, Input } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { AuthService } from 'src/app/services/auth.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AppTitleService } from 'src/app/services/app-title.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInOut]
})

export class HomeComponent {

  constructor(public configurations: ConfigurationService,
    private authService: AuthService,
    private externalAuthService: SocialAuthService,
    private alertService: AlertService,
    public appTitleService: AppTitleService
    ) {


  }
  loginStatusSubscription: any;

  ngOnInit() {

    this.externalAuthService.authState.subscribe((user) => {
      if(user) {
        console.log(user)
        this.externalLogin(user);

      }
    })

  }

  externalLogin = async (user: SocialUser) => {
    try {
      const loggedInUser = await this.authService.externalLogin(user, 'api/account/externallogin').toPromise();

      setTimeout(() => {

        this.alertService.showMessage('Login', `Welcome ${loggedInUser.userName}!`, MessageSeverity.success);


      }, 500);
    } catch (error) {
      this.alertService.stopLoadingMessage();



    }
  };
}
