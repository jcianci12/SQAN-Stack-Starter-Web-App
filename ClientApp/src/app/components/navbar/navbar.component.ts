import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { Permission } from '../../models/permission.model';
import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  

  @Input() appTitle: any;

  @Input() notificationsTitle: any;
  @Input() newNotificationCount!: number;
@Input() routerInput!:Router;





notificationsLoadingSubscription: any;
dataLoadingConsecutiveFailures = 0;

  constructor(
    private notificationService: NotificationService,
    private alertService: AlertService,
    public router:Router,
    private accountService: AccountService,
    public authService:AuthService,
    public apptitleService:AppTitleService

  ) { console.log(this.routerInput)}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribeNotifications();
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
  logout() {
    this.authService.logout();
    this.authService.redirectLogoutUser();
  }

  get canManageStore() {
    return this.accountService.userHasPermission(Permission.manageStorePermission); // eg. viewCustomersPermission
  }

}
