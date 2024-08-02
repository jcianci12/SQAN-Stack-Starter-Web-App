import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-personpill',
  templateUrl: './personpill.component.html',
  styleUrls: ['./personpill.component.scss']
})
export class PersonpillComponent implements OnInit {

  @Input() userName: any;


  constructor(    private authService:AuthService
    ) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.authService.redirectLogoutUser();
  }

}
