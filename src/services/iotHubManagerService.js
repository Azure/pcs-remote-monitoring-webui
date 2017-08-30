// Copyright (c) Microsoft. All rights reserved.

import Http from '../common/httpClient';
import Config from '../common/config';

/**
 * Contains methods for calling the Iot Hub Manager service
 */
class IotHubManagerService {

  static ENDPOINT = Config.iotHubManagerApiUrl;

  /**
   * Creates a physical device
   */

   /**
   * Creates a physical device
   *
   * @param {string} deviceId The id of the device
   * @param {string} primaryAuthKey The primary authentication key
   */
  static createPhysicalDevice(deviceId, primaryAuthKey) {
    return Http.post(
      `${IotHubManagerService.ENDPOINT}devices`, 
      { 
        Id: deviceId,
        AuthPrimaryKey: primaryAuthKey,
        isSimulated: false 
      }
    );
  }

}

export default IotHubManagerService;
