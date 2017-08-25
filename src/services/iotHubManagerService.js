// Copyright (c) Microsoft. All rights reserved.

import Http from '../common/httpClient';
import Config from '../common/config';

/**
 * Contains methods for calling the Iot Hub Manager service
 */
class IotHubDeviceManagerService {

  static ENDPOINT = Config.iotHubManagerApiUrl;

  /**
   * Creates a physical device
   */
  static createPhysicalDevice(data) {
    return Http.post(`${IotHubDeviceManagerService.ENDPOINT}devices`, data);
  }

}

export default IotHubDeviceManagerService;
