

import { Injectable } from '@angular/core'
import { Router, NavigationExtras } from '@angular/router'
import { firstValueFrom, Observable, Subject } from 'rxjs'
import { catchError, map, take } from 'rxjs/operators'

import { LocalStoreManager } from './local-store-manager.service'
import { OidcHelperService } from './oidc-helper.service'
import { ConfigurationService } from './configuration.service'
import { DBkeys } from './db-keys'
import { JwtHelper } from './jwt-helper'
import { Utilities } from './utilities'
import { AccessToken, LoginResponse } from '../models/login-response.model'
import { User } from '../models/user.model'
import { PermissionValues } from '../models/permission.model'
import { EndpointBase } from '../api/endpoint-base.service'
import { ApplicationUser } from '../api/Client'

import { GoogleLoginProvider, SocialAuthService } from "@abacritt/angularx-social-login";
import { AuthResponseDto, ExternalAuthDto } from '../externalAuthDto.model'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class AuthService {

  private authChangeSub = new Subject<boolean>();
  // public authChanged = this.authChangeSub.asObservable();
  // public extAuthChanged = this.extAuthChangeSub.asObservable();
  public isExternalAuth: boolean;

  public get loginUrl() {
    return this.configurations.loginUrl
  }
  public get homeUrl() {
    return this.configurations.homeUrl
  }

  public loginRedirectUrl!: string
  public logoutRedirectUrl!: string

  public reLoginDelegate!: () => void

  private previousIsLoggedInCheck = false
  public loginStatus = new Subject<boolean>()

  constructor(
    private router: Router,
    private oidcHelperService: OidcHelperService,
    public configurations: ConfigurationService,
    private localStorage: LocalStoreManager,
    // private externalauthservice:SocialAuthService
  ) {
    this.initializeLoginStatus()
  }

  // public signInWithGoogle = () => {
  //   this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }


  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  }
  private initializeLoginStatus() {
    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus()
    })
  }



  gotoPage(page: string, preserveParams = true) {
    const navigationExtras: NavigationExtras = {
      queryParamsHandling: preserveParams ? 'merge' : '',
      preserveFragment: preserveParams,
    }

    this.router.navigate([page], navigationExtras)
  }

  gotoHomePage() {
    this.router.navigate([this.homeUrl])
  }

  redirectLoginUser() {
    const redirect =
      this.loginRedirectUrl &&
        this.loginRedirectUrl !== '/' &&
        this.loginRedirectUrl !== ConfigurationService.defaultHomeUrl
        ? this.loginRedirectUrl
        : this.homeUrl
    this.loginRedirectUrl = ''

    const urlParamsAndFragment = Utilities.splitInTwo(redirect, '#')
    const urlAndParams = Utilities.splitInTwo(
      urlParamsAndFragment.firstPart,
      '?',
    )

    const navigationExtras: NavigationExtras = {
      fragment: urlParamsAndFragment.secondPart,
      queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
      queryParamsHandling: 'merge',
    }

    this.router.navigate([urlAndParams.firstPart], navigationExtras)
  }

  redirectLogoutUser() {
    const redirect = this.logoutRedirectUrl
      ? this.logoutRedirectUrl
      : this.loginUrl
    this.logoutRedirectUrl = ''

    this.router.navigate([redirect])
  }

  redirectForLogin() {
    this.loginRedirectUrl = this.router.url
    this.router.navigate([this.loginUrl])
  }

  reLogin() {
    if (this.reLoginDelegate) {

      this.reLoginDelegate()
    } else {
      this.redirectForLogin()
    }
  }

  refreshLogin() {
    console.log('refreshing frmo auth service')

    return this.oidcHelperService
      .refreshLogin()
      .pipe(map((resp) => this.processLoginResponse(resp, this.rememberMe)))

  }

  loginWithPassword(userName: string, password: string, rememberMe?: boolean) {
    if (this.isLoggedIn) {
      this.logout()
    }

    return this.oidcHelperService
      .loginWithPassword(userName, password)
      .pipe(map((resp) => this.processLoginResponse(resp, rememberMe)))
  }
  handleLoginObservable(): Observable<User> {
    return new Observable(subscriber => {
      //is the user logged in?
      if (this.isLoggedIn) {
        //the user is logged in
        //is the users token valid?
        if (this.oidcHelperService.isSessionExpired) {
          //refresh the token
          this.refreshLogin().pipe(take(1)).subscribe(r => { subscriber.next(this.currentUser) })
        }
        else {

          subscriber.next(this.currentUser)
        }
      }
      else {
        this.loginStatus.subscribe(i => {
          if (i == true) {
            subscriber.next(this.currentUser)
          }
        })
        this.reLogin()
      }
    })
  }

  public processLoginResponse(response: LoginResponse, rememberMe?: boolean) {
    console.log('processing login response', response)
    const accessToken = response.access_token

    if (accessToken == null) {
      throw new Error('accessToken cannot be null')
    }

    rememberMe = rememberMe || this.rememberMe

    const refreshToken = response.refresh_token || this.refreshToken
    const expiresIn = response.expires_in
    const tokenExpiryDate = new Date()
    tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn)
    const accessTokenExpiry = tokenExpiryDate
    const jwtHelper = new JwtHelper()
    const decodedAccessToken = jwtHelper.decodeToken(accessToken) as AccessToken

    const permissions: PermissionValues[] = Array.isArray(
      decodedAccessToken.permission,
    )
      ? decodedAccessToken.permission
      : [decodedAccessToken.permission]

    if (!this.isLoggedIn) {
      this.configurations.import(decodedAccessToken.configuration)
    }

    const user = new User(
      decodedAccessToken.sub,
      decodedAccessToken.name,
      decodedAccessToken.fullname,
      decodedAccessToken.email,
      decodedAccessToken.jobtitle,
      decodedAccessToken.phone_number,
      Array.isArray(decodedAccessToken.role)
        ? decodedAccessToken.role
        : [decodedAccessToken.role],
    )
    user.isEnabled = true

    this.saveUserDetails(
      user,
      permissions,
      accessToken,
      refreshToken,
      accessTokenExpiry,
      rememberMe,
    )
    this.reevaluateLoginStatus(user)

    return user
  }


  private saveUserDetails(
    user: User,
    permissions: PermissionValues[],
    accessToken: string,
    refreshToken: string,
    expiresIn: Date,
    rememberMe: boolean,
  ) {
    if (rememberMe) {
      this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN)
      this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN)
      this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN)
      this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS)
      this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER)
    } else {
      this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN)
      this.localStorage.saveSyncedSessionData(
        refreshToken,
        DBkeys.REFRESH_TOKEN,
      )
      this.localStorage.saveSyncedSessionData(
        expiresIn,
        DBkeys.TOKEN_EXPIRES_IN,
      )
      this.localStorage.saveSyncedSessionData(
        permissions,
        DBkeys.USER_PERMISSIONS,
      )
      this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER)
    }

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME)
  }

  async logout(): Promise<void> {

    this.localStorage.deleteData(DBkeys.ACCESS_TOKEN)
    this.localStorage.deleteData(DBkeys.REFRESH_TOKEN)
    this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN)
    this.localStorage.deleteData(DBkeys.USER_PERMISSIONS)
    this.localStorage.deleteData(DBkeys.CURRENT_USER)
    // this.externalauthservice.authState.pipe(take(1)).subscribe(a => {
    //   if (a) {
    //     this.externalauthservice.signOut();

    //   }
    // })
    // const a = await firstValueFrom(this.externalauthservice.authState)
    // if (a) {
    //   this.externalauthservice.signOut();

    // }
    this.configurations.clearLocalChanges()
    this.reevaluateLoginStatus()
  }

  private reevaluateLoginStatus(currentUser?: User) {
    const user =
      currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER)
    const isLoggedIn = user != null
    //console.log("re evaluating login status", user, isLoggedIn, this.previousIsLoggedInCheck)

    if (this.previousIsLoggedInCheck !== isLoggedIn) {
      setTimeout(() => {

        this.loginStatus.next(isLoggedIn)
      })
    }

    this.previousIsLoggedInCheck = isLoggedIn
  }

  getLoginStatusEvent(): Observable<boolean> {
    return this.loginStatus.asObservable()
  }

  get currentUser(): User {
    const user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER)
    this.reevaluateLoginStatus(user!)

    return user!
  }

  get userPermissions(): PermissionValues[] {
    return (
      this.localStorage.getDataObject<PermissionValues[]>(
        DBkeys.USER_PERMISSIONS,
      ) || []
    )
  }

  get accessToken(): string {
    return this.oidcHelperService.accessToken!
  }

  get accessTokenExpiryDate(): Date {
    return this.oidcHelperService.accessTokenExpiryDate!
  }

  get refreshToken(): string {
    return this.oidcHelperService.refreshToken
  }

  get isSessionExpired(): boolean {
    return this.oidcHelperService.isSessionExpired
  }

  get isLoggedIn(): boolean {
    return this.currentUser != null
  }

  get rememberMe(): boolean {
    return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) === true
  }
}
