// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { HttpClient } from './httpClient';
import { toDeviceGroupsModel } from './models';
import { stringToBoolean } from 'utilities';

const ENDPOINT = Config.serviceUrls.config;

/** Contains methods for calling the config service */
export class ConfigService {

  /** Returns a the account's device groups */
  static getDeviceGroups() {
    return HttpClient.get(`${ENDPOINT}devicegroups`)
      .map(toDeviceGroupsModel);
  }

  static getLogo() {
    var options = {};
    options.responseType = 'blob';
    options.headers = {
      'Accept': undefined,
      'Content-Type': undefined
    }
    return HttpClient.get(`${ENDPOINT}solution-settings/logo`, options, true, false)
    .map((response) =>  ConfigService.prepareLogoResponse(response));
  }

  static setLogo(logo, header) {
    const options = {
      headers: header,
      responseType: 'blob'
    };

    if(!logo) {
      logo = '';
    }

    options.headers['Accept'] = undefined;
    return HttpClient.put(`${ENDPOINT}solution-settings/logo`, logo, options, true, false)
    .map((response) => ConfigService.prepareLogoResponse(response));
  }

  static prepareLogoResponse(responseWrapper) {
    const returnObj = {};
    const xhr = responseWrapper.xhr;
    const isDefault = xhr.getResponseHeader("IsDefault");
    if(!stringToBoolean(isDefault)) {
      const appName = xhr.getResponseHeader("Name");
      if(appName) {
        returnObj['name'] = appName;
      }
      const blob = responseWrapper.response;
      if(blob && blob.size > 0) {
        returnObj['logo'] = URL.createObjectURL(blob);
      }
    }
    return returnObj;
  }
}
