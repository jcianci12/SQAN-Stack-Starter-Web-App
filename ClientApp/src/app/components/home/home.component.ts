

import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { AuthService } from 'src/app/services/auth.service';
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
    private alertService: AlertService,
    public appTitleService: AppTitleService

    ) {


  }
  loginStatusSubscription: any;

  ngOnInit() {


  }

}
