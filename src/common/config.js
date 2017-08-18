// Copyright (c) Microsoft. All rights reserved.

const baseURL = process.env.REACT_APP_BASE_URL || window.location.hostname;

const Config = {
  STATUS_CODES: {
    CRITICAL: 'critical',
    WARNING: 'warning',
    EQ: 'Equals',
    GT: 'Greater than',
    LT: 'Less than',
    GE: 'Greater than/equal',
    LE: 'Less than/equal',
    BRACKET: 'In',
    OPENBRACKET: 'Starts with',
    CLOSEBRACKET: 'Ends with',
    DEFAULTPUSHPINTEXTLENGTH: 10
  },
  INTERVALS: {
    TELEMETRY_FLOW_DURATION: 1500,
    TELEMETRY_UPDATE_INTERVAL: 2500,
    TELEMETRY_SLIDE_WINDOW: 15
  },
  uiConfigApiUrl: `${baseURL}uiconfig/v1/`,
  deviceSimulationApiUrl: `${baseURL}devicesimulation/v1/`,
  iotHubManagerApiUrl: `${baseURL}iothubmanager/v1/`,
  telemetryApiUrl: `${baseURL}devicetelemetry/v1/`,
  msTelemetryApiRefreshInterval: 2
};

export default Config;
