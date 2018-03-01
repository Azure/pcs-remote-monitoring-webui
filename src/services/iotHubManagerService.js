// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { HttpClient } from './httpClient';
import { toDevicesModel } from './models';

const ENDPOINT = Config.baseUrls.iotHubManager;

/** Contains methods for calling the Device service */
export class IoTHubManagerService {

  /** Returns a list of devices */
  static getDevices() {
    return HttpClient.get(`${ENDPOINT}devices`)
      .map(toDevicesModel);
  }
}
