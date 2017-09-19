// Copyright (c) Microsoft. All rights reserved.

import Http from '../common/httpClient';
import Config from '../common/config';

/**
 * Contains methods for calling the telemetry microservice
 */
class DeviceTelemetryService {

  static ENDPOINT = Config.telemetryApiUrl;
}

export default DeviceTelemetryService;
