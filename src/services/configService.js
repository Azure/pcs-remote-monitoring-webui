// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { HttpClient } from './httpClient';
import {
  prepareLogoResponse,
  toDeviceGroupModel,
  toDeviceGroupsModel,
  toSolutionSettingThemeModel
} from './models';
import { Observable } from '../../node_modules/rxjs';

const ENDPOINT = Config.serviceUrls.config;

/** Contains methods for calling the config service */
export class ConfigService {

  /** Returns a the account's device groups */
  static getDeviceGroups() {
    return HttpClient.get(`${ENDPOINT}devicegroups`)
      .map(toDeviceGroupsModel);
  }

  /** Creates a new device group */
  static createDeviceGroup(payload) {
    return HttpClient.post(`${ENDPOINT}devicegroups`, payload)
      .map(toDeviceGroupModel);
  }

  static updateDeviceGroup(id, payload) {
    return HttpClient.put(`${ENDPOINT}devicegroups/${id}`, payload)
      .map(toDeviceGroupModel);
  }

  /** Delete a device group */
  static deleteDeviceGroup(id) {
    return HttpClient.delete(`${ENDPOINT}devicegroups/${id}`)
      .map(_ => id);
  }

  static getLogo() {
    var options = {};
    options.responseType = 'blob';
    options.headers = {
      'Accept': undefined,
      'Content-Type': undefined
    }
    return HttpClient.get(`${ENDPOINT}solution-settings/logo`, options)
      .map(prepareLogoResponse);
  }

  static setLogo(logo, header) {
    const options = {
      headers: header,
      responseType: 'blob'
    };

    if (!logo) {
      logo = '';
    }

    options.headers['Accept'] = undefined;
    return HttpClient.put(`${ENDPOINT}solution-settings/logo`, logo, options)
      .map(prepareLogoResponse);
  }

  /* Get solution settings.
      The API name is "solution-settings/theme" even though it deals with diagnosticsOptIn,
      AzureMapsKeys, name, description and UI theme. */
  static getSolutionSettings() {
    return HttpClient.get(`${ENDPOINT}solution-settings/theme`)
      .map(toSolutionSettingThemeModel)
      /* When the application loads for the first time, there won't be "solution-settings"
       in the storage. In that case, service will throw a 404 not found error.
       But we need to ignore that and stick with the static values defined in UI state */
      .catch(error =>
        error.status === 404 ? Observable.empty() : Observable.throw(error)
      );
  }

  /* Update solution settings.
     The API name is "solution-settings/theme" even though it deals with diagnosticsOptIn,
      AzureMapsKeys, name, description and UI theme.*/
  static updateSolutionSettings(model) {
    return HttpClient.put(`${ENDPOINT}solution-settings/theme`, model)
      .map(toSolutionSettingThemeModel);
  }
}
