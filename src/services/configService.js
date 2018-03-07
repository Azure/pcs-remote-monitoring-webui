// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { HttpClient } from './httpClient';
import { toDeviceGroupsModel } from './models';

const ENDPOINT = Config.serviceUrls.config;

/** Contains methods for calling the config service */
export class ConfigService {

  /** Returns a the account's device groups */
  static getDeviceGroups() {
    return HttpClient.get(`${ENDPOINT}devicegroups`)
      .map(toDeviceGroupsModel);
  }
}
