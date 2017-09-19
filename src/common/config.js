// Copyright (c) Microsoft. All rights reserved.

const baseURL = process.env.REACT_APP_BASE_SERVICE_URL || '';

const iothubmanagerPath = process.env.REACT_APP_IOTHUBMANAGER_WEBSERVICE_PORT
  ? ':' + process.env.REACT_APP_IOTHUBMANAGER_WEBSERVICE_PORT
  : '/iothubmanager';

const devicesimulationPath = process.env.REACT_APP_DEVICESIMULATION_WEBSERVICE_PORT
  ? ':' + process.env.REACT_APP_DEVICESIMULATION_WEBSERVICE_PORT
  : '/devicesimulation';

const configPath = process.env.REACT_APP_CONFIG_WEBSERVICE_PORT
  ? ':' + process.env.REACT_APP_CONFIG_WEBSERVICE_PORT
  : '/config';

const telemetryPath = process.env.REACT_APP_TELEMETRY_WEBSERVICE_PORT
  ? ':' + process.env.REACT_APP_TELEMETRY_WEBSERVICE_PORT
  : '/telemetry';

const authPath = process.env.REACT_APP_AUTH_WEBSERVICE_PORT
  ? ':' + process.env.REACT_APP_AUTH_WEBSERVICE_PORT
  : '/auth';

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
    INT: 'Int',
    STRING: 'String',
    BOOLEAN: 'Boolean',
    OPENBRACKET: '[ Starts with',
    CLOSEBRACKET: '] Ends with',
    TYPE: 'Type',
    DEFAULTPUSHPINTEXTLENGTH: 10,
    MULTIPLE: 'Multiple',
    FIRMWARE: 'Firmware',
    TEST: 'Tags.test',
    COUNTRY: 'Tags.country',
    BUILDING: 'Tags.Building',
    FLOOR: 'Tags.Floor',
    REGION: 'Tags.Region',
    IS_SIMULATED: 'Tags.IsSimulated',
    IS_SIMULATED_WITHOUT_TAGS: 'IsSimulated',
    REPORTED_TYPE: 'Properties.Reported.Type',
    REPORTED_LOCATION: 'Properties.Reported.Location'
  },

  OPERATOR_OPTIONS: [
    { value: 'GreaterThan', label: '>' },
    { value: 'GreaterThanOrEqual', label: '>=' },
    { value: 'LessThan', label: '<' },
    { value: 'LessThanOrEqual', label: '<=' },
    { value: 'Equals', label: '=' }
  ],

  INTERVALS: {
    TELEMETRY_FLOW_DURATION: 1500,
    TELEMETRY_UPDATE_INTERVAL: 2500,
    TELEMETRY_SLIDE_WINDOW: 15
  },

  iotHubManagerApiUrl: `${baseURL}${iothubmanagerPath}/v1/`,
  deviceSimulationApiUrl: `${baseURL}${devicesimulationPath}/v1/`,
  configApiUrl: `${baseURL}${configPath}/v1/`,
  telemetryApiUrl: `${baseURL}${telemetryPath}/v1/`,
  authApiUrl: `${baseURL}${authPath}/v1/`,
  msTelemetryApiRefreshInterval: 2
};

export default Config;
