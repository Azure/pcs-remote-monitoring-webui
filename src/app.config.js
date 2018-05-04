// Copyright (c) Microsoft. All rights reserved.
const baseUrl = process.env.REACT_APP_BASE_SERVICE_URL || '';
const validExtensions = ['.png', '.jpeg', '.jpg', '.svg'];

const Config = {
  serviceUrls: {
    config: `${baseUrl}/config/v1/`,
    iotHubManager: `${baseUrl}/iothubmanager/v1/`,
    telemetry: `${baseUrl}/telemetry/v1/`,
    deviceSimulation: `${baseUrl}/devicesimulation/v1/`,
    //TODO: Determine if should query java or dotnet
    gitHubReleases: 'https://api.github.com/repos/Azure/azure-iot-pcs-remote-monitoring-dotnet/releases'
  },
  // Constants
  defaultAjaxTimeout: 20000, // 20s
  maxRetryAttempts: 2,
  retryWaitTime: 2000, // On retryable error, retry after 2s
  retryableStatusCodes: new Set([ 0, 502, 503 ]),
  paginationPageSize: 50,
  smallGridPageSize: 8,
  clickDebounceTime: 180, // ms
  gridResizeDebounceTime: 200, // ms
  dashboardRefreshInterval: 15000, // 15 seconds
  telemetryRefreshInterval: 1000, // 1 seconds
  simulationId: '1',
  validExtensions: validExtensions.join(),
  emptyValue: '--',
  maxTopAlerts: 5,
  maxAlertsCount: 1000,
  gridMinResize: 1200, // In px
  ruleSeverity: {
    info: 'info',
    warning: 'warning',
    critical: 'critical'
  },
  alertStatus: {
    open: 'open',
    closed: 'closed',
    acknowledged: 'acknowledged'
  },
  maxLogoFileSizeInBytes: 307200
};

export default Config;
