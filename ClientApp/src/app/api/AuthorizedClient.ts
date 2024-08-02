import { Inject, Injectable } from "@angular/core";
import { EndpointBase } from "./endpoint-base.service";
import { inject } from "@angular/core/testing";
import { AuthGuard } from "../services/auth-guard.service";

export class IConfig extends EndpointBase {
  // constructor(public epb: EndpointBase) { }

  /**
   * Returns a valid value for the Authorization header.
   * Used to dynamically inject the current auth header.
   */

}

@Injectable()

export class AuthorizedClient {
  private readonly config: IConfig;

  protected constructor(config: IConfig) {
    this.config = config;
  }
  hasAuthGuard(routePath: string): boolean {
    const route = this.config.router.config.find((r) => r.path === routePath);
    return !!route?.canActivate && route.canActivate.includes(AuthGuard);
  }
  protected async transformOptions(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
        let pathWithLeadingSlash = this.config.router.routerState.snapshot.url.split('?')[0]; // Extracting the path from the URL
        let path = pathWithLeadingSlash.substring(1); // Remove the leading '/'
        let hasauthguard = this.hasAuthGuard(path)
        console.log(hasauthguard)

        if (hasauthguard) { // Add a conditional check
            this.config.authService.handleLoginObservable().subscribe(i => {
                let bearer = this.config.getBearer
                let bearertest = this.config.requestHeaders.headers
                //console.log('adding', bearer)
                options.headers = options.headers.append(
                    'authorization',
                    `Bearer ${bearer}`,
                )
                resolve(options)
            })
        } else {
          let bearer = this.config.getBearer
          let bearertest = this.config.requestHeaders.headers
          //console.log('adding', bearer)
          // options.headers = options.headers.append(
          //     'authorization',
          //     `Bearer ${bearer}`,
          // )
          resolve(options)
        }
    })
}

}
