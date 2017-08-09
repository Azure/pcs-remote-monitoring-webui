// Copyright (c) Microsoft. All rights reserved.

// TODO: clean up old services
const Config = {
  STATUS_CODES: {
    CRITICAL: 'critical',
    WARNING: 'warning',
    DEFAULTPUSHPINTEXTLENGTH: 10
  },
  solutionApiUrl: process.env.REACT_APP_OLD_UICONFIG_WEBSERVICE_URL,
  uiConfigApiUrl: process.env.REACT_APP_OLD_UICONFIG_WEBSERVICE_URL,
  deviceSimulationApiUrl: process.env.REACT_APP_DEVICESIMULATION_WEBSERVICE_URL,
  iotHubManagerApiUrl: process.env.REACT_APP_IOTHUBMANAGER_WEBSERVICE_URL,
  telemetryApiUrl: process.env.REACT_APP_TELEMETRY_WEBSERVICE_URL,
  deviceGroupApiUrl:
    process.env.REACT_APP_OLD_UICONFIG_WEBSERVICE_URL +
    'api/v1/devicegroups/list',
  telemetryTypeApiUrl:
    process.env.REACT_APP_OLD_UICONFIG_WEBSERVICE_URL + 'api/v1/telemetrytypes',
  telemetryApiUrl_new: process.env.REACT_APP_TELEMETRY_WEBSERVICE_URL,
  iotHubManagerApiUrl_new: process.env.REACT_APP_IOTHUBMANAGER_WEBSERVICE_URL,
  uiConfigApiUrl_new: process.env.REACT_APP_UICONFIG_WEBSERVICE_URL
};
export default Config;
