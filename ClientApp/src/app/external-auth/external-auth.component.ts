import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertCommand, AlertService, DialogType, MessageSeverity } from '../services/alert.service';
import { NotificationService } from '../services/notification.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { LoginComponent } from '../components/account/login/login.component';
import { firstValueFrom, map, Observable, Subject } from 'rxjs'
import { ExternalAuthDto } from '../externalAuthDto.model';
import { LoginResponse } from '../models/login-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigurationService } from '../services/configuration.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'


@Component({
  selector: 'app-external-auth',
  templateUrl: './external-auth.component.html',
  styleUrls: ['./external-auth.component.scss']
})
@ViewChildren('loginModal,loginControl')

export class ExternalAuthComponent {
  isUserLoggedIn!: boolean;
  shouldShowLoginModal!: boolean;
  isAppLoaded!: boolean;

  removePrebootScreen!: boolean;
  stickyToasties: number[] = [];

  loginModal!: ModalDirective;

  dataLoadingConsecutiveFailures = 0;
  notificationsLoadingSubscription: any;
  newNotificationCount = 0;
  loginControl!: LoginComponent;

  private extAuthChangeSub = new Subject<SocialUser>();

  constructor(private externalAuthService: SocialAuthService,
    public authService: AuthService,
    private alertService: AlertService,
    private notificationService: NotificationService,
    public router: Router,
    private configservice: ConfigurationService, private snackbar: MatSnackBar,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn;

    // 0.5 extra sec to display preboot/loader information. Preboot screen is removed 0.5 sec later
    setTimeout(() => this.isAppLoaded = true, 500);
    setTimeout(() => this.removePrebootScreen = true, 1000);

    setTimeout(() => {
      if (this.isUserLoggedIn) {
        this.alertService.resetStickyMessage();

        if (!this.authService.isSessionExpired) {
          console.log("fullname", this.authService.currentUser.fullName)
          if (!this.authService.currentUser.fullName) {
            this.alertService.showDialog("Your profile is incomplete, please click below to update it.", DialogType.confirm, () => this.router.navigate(['/settings']), () => this.alertService.resetStickyMessage(), "Take me to my profile.", "Later.");
          }
          else {
            this.alertService.showMessage('Login', `Welcome back ${this.userName}!`, MessageSeverity.default);

          }

        }
        else
          // this.authService.logout();

          this.alertService.showStickyMessage("Session Expired", "Your Session has expired. Please log in again", MessageSeverity.warn);
      }
    }, 2000);
    this.authService.loginStatus.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        
      }
    })


    // this.alertService.getDialogEvent().subscribe(alert => this.showDialog(alert));
    this.alertService.getMessageEvent().subscribe(message => this.showToast(message));

    this.authService.reLoginDelegate = () => {
      setTimeout(() => {

        this.shouldShowLoginModal = true;


      }, 100);
    }


    this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;


      if (this.isUserLoggedIn) {
        this.initNotificationsLoading();
      } else {
        this.unsubscribeNotifications();
      }

      setTimeout(() => {
        if (!this.isUserLoggedIn) {
          this.alertService.showMessage('Session Ended!', '', MessageSeverity.default);
        }
      }, 500);
    });
    this.externalAuthService.authState.subscribe((user) => {
      if (user) {
        console.log(user)
        this.externalLogin(user);

      }
    })
  }
  async logoutexternal():Promise<void>{
  
  }
  public signOutExternal = () => {
    this.externalAuthService.signOut();
  }


  public handleExternalLoginRequest = (user: SocialUser, route: string) => {
    if (this.authService.isLoggedIn || user.id == this.authService.currentUser?.id) {
      return;
    }
    this.extAuthChangeSub.next(user);
    this.authService.isExternalAuth = true;
    const externalAuth: ExternalAuthDto = {
      provider: user.provider,
      idToken: user.idToken
    }

    return this.http.post<LoginResponse>(this.createCompleteRoute(route, this.configservice.baseUrl), externalAuth)
      .pipe(map((resp) => {
        this.authService.sendAuthStateChangeNotification(!!resp.access_token);
        return this.authService.processLoginResponse(resp, false);
      }))

  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
  ngAfterViewInit() {



    if (this.authService.isLoggedIn) {
      if (this.authService.isSessionExpired) {
        this.authService.reLogin()
      }
      else {
        this.authService.refreshLogin()
      }
    }
  }

  onLoginModalHide() {
    this.alertService.resetStickyMessage();
  }




  externalLogin = async (user: SocialUser) => {
    try {
      const loggedInUser = await this.handleExternalLoginRequest(user, 'api/account/externallogin').toPromise();
  
      setTimeout(() => {
        this.alertService.showMessage('Login', `Welcome ${loggedInUser.userName}!`, MessageSeverity.success);
        this.loginModal?.hide();
      }, 10);
    } catch (error) {
      this.alertService.showDialog(error.error, DialogType.alert,null,null,null);

      if (error.status === 400) {
        const errorMessage = error.error || 'Error occurred. Please try again.';
        this.alertService.showMessage('Login', errorMessage, MessageSeverity.error);
      } else {
        this.alertService.showMessage('Login', error.message, MessageSeverity.error);
      }
  
      this.alertService.stopLoadingMessage();
    }
  };

  ngOnDestroy() {
    this.unsubscribeNotifications();
  }

  externalLogout() {
    this.authService.logout();

    this.authService.redirectLogoutUser();
  }

  showToast(alert: AlertCommand) {

    if (alert.operation === 'clear') {
      for (const id of this.stickyToasties.slice(0)) {

        //this.toastaService.clear(id);

        //this.snackbar.dismiss()

      }

      return;
    }

  }


  private unsubscribeNotifications() {
    if (this.notificationsLoadingSubscription) {
      this.notificationsLoadingSubscription.unsubscribe();
    }
  }



  initNotificationsLoading() {

    this.notificationsLoadingSubscription = this.notificationService.getNewNotificationsPeriodically()
      .subscribe(notifications => {
        this.dataLoadingConsecutiveFailures = 0;
        this.newNotificationCount = notifications.filter(n => !n.isRead).length;
      },
        error => {
          this.alertService.logError(error);

          if (this.dataLoadingConsecutiveFailures++ < 20) {
            setTimeout(() => this.initNotificationsLoading(), 5000);
          } else {
            this.alertService.showStickyMessage('Load Error', 'Loading new notifications from the server failed!', MessageSeverity.error);
          }
        });
  }


  markNotificationsAsRead() {

    const recentNotifications = this.notificationService.recentNotifications;

    if (recentNotifications.length) {
      this.notificationService.readUnreadNotification(recentNotifications.map(n => n.id), true)
        .subscribe(response => {
          for (const n of recentNotifications) {
            n.isRead = true;
          }

          this.newNotificationCount = recentNotifications.filter(n => !n.isRead).length;
        },
          error => {
            this.alertService.logError(error);
            this.alertService.showMessage('Notification Error', 'Marking read notifications failed', MessageSeverity.error);

          });
    }
  }

  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : '';
  }
  get fullName(): string {
    return this.authService.currentUser ? this.authService.currentUser.fullName : '';
  }
}
