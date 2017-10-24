// Copyright (c) Microsoft. All rights reserved.

import Http from '../common/httpClient';
import Config from '../common/config';

/**
 * Contains methods for calling the telemetry microservice
 */
class DeviceTelemetryService {

  static ENDPOINT = Config.telemetryApiUrl;

  static getRuleList(params={}) {
    return Http.get(`${DeviceTelemetryService.ENDPOINT}rules?${DeviceTelemetryService.serializeParamObject(params)}`);
  }

  static serializeParamObject(params) {
    return Object.keys(params)
      .map(param => `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
      .join('&');
  }
}

export default DeviceTelemetryService;
