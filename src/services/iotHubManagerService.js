// Copyright (c) Microsoft. All rights reserved.

import Http from '../common/httpClient';
import Config from '../common/config';

/**
 * Contains methods for calling the Iot Hub Manager service
 */
class IotHubManagerService {

  static ENDPOINT = Config.iotHubManagerApiUrl;

  static AUTH_TYPE = {
    Sas: 0,
    SelfSigned: 1
  };

   /**
   * Creates a physical device
   *
   * @param {string} params Parameters for creating a new device
   *    Id: The ID of the new device. Is auto generated if left empty
   *    Authentication: An object containg auth parameters. Generates a symmetric key if left empty
   *      AuthenticationType: Either symmetric or x509 auth (use the AUTH_TYPE enum)
   *      PrimaryKey/PrimaryThumprint: The value for the primary key or thumprint
   *      SecondaryKey/SecondaryThumbprint: The value for the secondary key or thumprint
   */
  static createPhysicalDevice(params) {
    return Http.post(`${IotHubManagerService.ENDPOINT}devices`, { ...params, IsSimulated: false });
  }


  /**
   * Returns the list of devices
   */
  static getDevices() {
    return Http.get(`${IotHubManagerService.ENDPOINT}devices`)
  }

  static serializeParamObject(params) {
    return Object.keys(params)
      .map(param => `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
      .join('&');
  }
}

export default IotHubManagerService;
