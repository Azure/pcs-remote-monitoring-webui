// Copyright (c) Microsoft. All rights reserved.

const baseURL = process.env.REACT_APP_BASE_SERVICE_URL || window.location.hostname;
const iothubmanager = process.env.REACT_APP_IOTHUBMANAGER_WEBSERVICE_PORT ? ':' + process.env.REACT_APP_IOTHUBMANAGER_WEBSERVICE_PORT : '/iothubmanager';
const devicesimulation = process.env.REACT_APP_DEVICESIMULATION_WEBSERVICE_PORT ? ':' + process.env.REACT_APP_DEVICESIMULATION_WEBSERVICE_PORT : '/devicesimulation';
const uiconfig = process.env.REACT_APP_UICONFIG_WEBSERVICE_PORT ? ':' + process.env.REACT_APP_UICONFIG_WEBSERVICE_PORT : '/uiconfig';
const devicetelemetry = process.env.REACT_APP_DEVICETELEMETRY_WEBSERVICE_PORT ? ':' + process.env.REACT_APP_DEVICETELEMETRY_WEBSERVICE_PORT : '/devicetelemetry';
const auth = process.env.REACT_APP_AUTH_WEBSERVICE_PORT ? ':' + process.env.REACT_APP_AUTH_WEBSERVICE_PORT : '/auth';

const Config = {
  STATUS_CODES: {
    CRITICAL: 'critical',
    WARNING: 'warning',
    EQ: '= Equals',
    GT: '> Greater than',
    LT: '< Less than',
    GE: '>= Greater than/equal',
    LE: '<= Less than/equal',
    BRACKET: '[] In',
    OPENBRACKET: '[ Starts with',
    CLOSEBRACKET: '] Ends with',
    DEFAULTPUSHPINTEXTLENGTH: 10
  },
  INTERVALS: {
    TELEMETRY_FLOW_DURATION: 1500,
    TELEMETRY_UPDATE_INTERVAL: 2500,
    TELEMETRY_SLIDE_WINDOW: 15
  },

  iotHubManagerApiUrl: `${baseURL}${iothubmanager}/v1/`,
  deviceSimulationApiUrl: `${baseURL}${devicesimulation}/v1/`,
  uiConfigApiUrl: `${baseURL}${uiconfig}/v1/`,
  telemetryApiUrl: `${baseURL}${devicetelemetry}/v1/`,
  authApiUrl: `${baseURL}${auth}/v1`,
  msTelemetryApiRefreshInterval: 2
};

export default Config;
