// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import AuthenticationContext from 'adal-angular/dist/adal.min.js'
import { Observable } from 'rxjs';
import { HttpClient } from 'utilities/httpClient';
import { toUserModel, authDisabledUser } from './models';

const ENDPOINT = Config.serviceUrls.auth;

export class AuthService {

  static authContext; // Created on AuthService.initialize()
  static authEnabled = false;
  static aadInstance = '';
  static appId = '00000000-0000-0000-0000-000000000000';
  static tenantId = '00000000-0000-0000-0000-000000000000';
  static clientId = '00000000-0000-0000-0000-000000000000';

  static initialize() {
    if (typeof global.DeploymentConfig === 'undefined') {
      alert('The dashboard configuration is missing.\n\nVerify the content of webui-config.js.');
      throw new Error('The global configuration is missing. Verify the content of webui-config.js.');
    }

    if (typeof global.DeploymentConfig.authEnabled !== 'undefined') {
      AuthService.authEnabled = global.DeploymentConfig.authEnabled;
      if (!AuthService.authEnabled) {
        console.warn('Auth is disabled! (see webui-config.js)');
      }
    }

    AuthService.tenantId = global.DeploymentConfig.aad.tenant;
    AuthService.clientId = global.DeploymentConfig.aad.appId;
    AuthService.appId = global.DeploymentConfig.aad.appId;
    AuthService.aadInstance = global.DeploymentConfig.aad.instance;

    if (AuthService.aadInstance && AuthService.aadInstance.endsWith('{0}')) {
      AuthService.aadInstance = AuthService.aadInstance.substr(0, AuthService.aadInstance.length - 3);
    }

    // TODO: support multiple types/providers
    if (AuthService.isEnabled() && global.DeploymentConfig.authType !== 'aad') {
      throw new Error(`Unknown auth type: ${global.DeploymentConfig.authType}`);
    }

    AuthService.authContext = new AuthenticationContext({
      instance: AuthService.aadInstance,
      tenant: AuthService.tenantId,
      clientId: AuthService.clientId,
      redirectUri: window.location.origin,
      expireOffsetSeconds: 300, // default is 120
      postLogoutRedirectUri: window.location.origin
    });
  }

  static isDisabled() {
    return AuthService.authEnabled === false;
  }

  static isEnabled() {
    return !AuthService.isDisabled();
  }

  static onLoad(successCallback) {
    AuthService.initialize();
    if (AuthService.isDisabled()) {
      console.debug('Skipping Auth onLoad because Auth is disabled');
      if (successCallback) successCallback();
      return;
    };

    // Note: "window.location.hash" is the anchor part attached by
    //       the Identity Provider when redirecting the user after
    //       a successful authentication.
    if (AuthService.authContext.isCallback(window.location.hash)) {
      console.debug('Handling Auth Window callback');
      // Handle redirect after authentication
      AuthService.authContext.handleWindowCallback();
      const error = AuthService.authContext.getLoginError();
      if (error) {
        throw new Error(`Authentication Error: ${error}`);
      }
    } else {
      AuthService.getUserName(user => {
        if (user) {
          console.log(`Signed in as ${user.Name} with ${user.Email}`);
          if (successCallback) successCallback();
        } else {
          console.log('The user is not signed in');
          AuthService.authContext.login();
        }
      });
    }
  }

  static getUserName(callback) {
    if (AuthService.isDisabled()) return;

    if (AuthService.authContext.getCachedUser()) {
      Observable.of({ Name: 'Temp Name', Email: 'temp.name@contoso.com' })
        .map(data => data ? { Name: data.Name, Email: data.Email } : null)
        .subscribe(callback);
    } else {
      console.log('The user is not signed in');
      AuthService.authContext.login();
    }
  }

  /** Returns a the current user */
  static getCurrentUser() {
    if (AuthService.isDisabled()) {
      return Observable.of(authDisabledUser);
    }

    return HttpClient.get(`${ENDPOINT}users/current`)
      .map(toUserModel);
  }

  static logout() {
    if (AuthService.isDisabled()) return;

    AuthService.authContext.logOut();
    AuthService.authContext.clearCache();
  }

  /**
   * Acquires token from the cache if it is not expired.
   * Otherwise sends request to AAD to obtain a new token.
   */
  static getAccessToken() {
    if (AuthService.isDisabled()) {
      return Observable.of('client-auth-disabled');
    }

    return Observable.create(observer => {
      return AuthService.authContext.acquireToken(
        AuthService.appId,
        (error, accessToken) => {
          if (error) {
            console.log(`Authentication Error: ${error}`);
            observer.error(error);
          }
          else observer.next(accessToken);
          observer.complete();
        }
      );
    });
  }
}
