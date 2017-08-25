// Copyright (c) Microsoft. All rights reserved.

import Http from '../common/httpClient';
import Config from '../common/config';

/**
 * Contains methods for calling the device simulation microservice
 */
class DeviceSimulationService {

  static ENDPOINT = Config.deviceSimulationApiUrl;

  /**
   * Get the list of supported simulated device models
   */
  static getDevicemodels() {
    return Http.get(`${DeviceSimulationService.ENDPOINT}devicemodels`)
      .then(data => data.Items);
  }

}

export default DeviceSimulationService;
