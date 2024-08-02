

import { Inject, Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, from, throwError } from 'rxjs';
import { mergeMap, switchMap, catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { ConfigurationService } from '../services/configuration.service';
import { AuthGuard } from '../services/auth-guard.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()

export class EndpointBase {

  private taskPauser!: Subject<any> | null;
  private isRefreshingLogin!: boolean;

  constructor(
    protected http: HttpClient,
    public authService: AuthService,
    public ag:AuthGuard,
    public router: Router,
    public activatedRoute: ActivatedRoute,

    ) {

  }

  public get requestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.accessToken,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*'
    });
    // console.log("Authenticating with token:", this.authService.accessToken)
    headers.set("Authorisation", 'Bearer ' + this.authService.accessToken)

    return { headers };
  }
  public get getBearer(): string {
    return this.authService.accessToken
  }
  public refreshLogin(): Observable<User> {
    console.log("refreshing login from endpoint base service")

    return this.authService.refreshLogin().pipe(
      catchError(error => {
        return this.handleError(error, () => this.refreshLogin());
      }));
  }

  public handleError(error: { status: number; error: { error: string; error_description: any; }; }, continuation: () => Observable<any>) {
    if (error.status == 401) {
      if (this.isRefreshingLogin) {
        return this.pauseTask(continuation);
      }

      this.isRefreshingLogin = true;

      return from(this.authService.refreshLogin()).pipe(
        mergeMap(() => {
          this.isRefreshingLogin = false;
          this.resumeTasks(true);

          return continuation();
        }),
        catchError(refreshLoginError => {
          this.isRefreshingLogin = false;
          this.resumeTasks(false);
          this.authService.reLogin();

          if (refreshLoginError.status == 401 || (refreshLoginError.error && refreshLoginError.error.error == 'invalid_grant')) {
            return throwError('session expired');

          } else {
            return throwError(refreshLoginError || 'server error');
          }
        }));
    }

    if (error.error && error.error.error == 'invalid_grant') {
      this.authService.reLogin();

      return throwError((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
    } else {
      return throwError(error);
    }
  }



  private pauseTask(continuation: () => Observable<any>) {
    if (!this.taskPauser) {
      this.taskPauser = new Subject();
    }

    return this.taskPauser.pipe(switchMap(continueOp => {
      return continueOp ? continuation() : throwError('session expired');
    }));
  }


  private resumeTasks(continueOp: boolean) {
    setTimeout(() => {
      if (this.taskPauser) {
        this.taskPauser.next(continueOp);
        this.taskPauser.complete();
        this.taskPauser = null;
      }
    });
  }
}
