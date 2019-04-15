// Copyright (c) Microsoft. All rights reserved.
const baseUrl = process.env.REACT_APP_BASE_SERVICE_URL || '';
const validExtensions = ['.png', '.jpeg', '.jpg', '.svg'];

const Config = {
  serviceUrls: {
    auth: `${baseUrl}/auth/v1/`,
    config: `${baseUrl}/config/v1/`,
    iotHubManager: `${baseUrl}/iothubmanager/v1/`,
    telemetry: `${baseUrl}/telemetry/v1/`,
    deviceSimulation: `${baseUrl}/devicesimulation/v1/`,
    diagnostics: `${baseUrl}/diagnostics/v1/`,
    privacy: 'https://privacy.microsoft.com/privacystatement',
    //TODO: Determine if should query java or dotnet
    gitHubReleases: `https://api.github.com/repos/Azure/azure-iot-pcs-remote-monitoring-dotnet/releases/tags/3.0.0`
  },
  contextHelpUrls: {
    accessDenied: 'https://docs.microsoft.com/azure/iot-accelerators/iot-accelerators-remote-monitoring-rbac#add-or-remove-users',
    rolesAndPermissions: 'https://docs.microsoft.com/azure/iot-accelerators/iot-accelerators-remote-monitoring-rbac',
    ruleActionsEmail: 'https://go.microsoft.com/fwlink/?linkid=2041110&clcid=0x409',
    exploreTimeSeries: 'https://docs.microsoft.com/azure/iot-accelerators/iot-accelerators-remote-monitoring-rbac-tsi',
    deploymentPriority: 'https://docs.microsoft.com/en-us/azure/iot-edge/module-deployment-monitoring#priority'
  },
  // Constants
  showWalkthroughExamples: false,
  defaultAjaxTimeout: 20000, // 20s
  maxRetryAttempts: 2,
  retryWaitTime: 2000, // On retryable error, retry after 2s
  retryableStatusCodes: new Set([0, 401, 502, 503]),
  paginationPageSize: 50,
  smallGridPageSize: 8,
  clickDebounceTime: 180, // ms
  gridResizeDebounceTime: 200, // ms
  dashboardRefreshInterval: 15000, // 15 seconds
  telemetryRefreshInterval: 1000, // 1 seconds
  actionSetupPollingInterval: 20 * 1000, // every 20 seconds
  actionSetupPollingTimeLimit: 2 * 60 * 1000, // for up to 2 minutes
  simulationId: '1',
  validExtensions: validExtensions.join(),
  emptyFieldValue: '---', // for use in grid columns
  emptyValue: '--', // for use in stat components
  maxTopAlerts: 5,
  maxAlertsCount: 1000,
  gridMinResize: 1200, // In px
  mapCenterPosition: [-122.3320708, 47.606], // Default to Seattle
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
  maxLogoFileSizeInBytes: 307200,
  device: {
    device: 'IoT device',
    edgeDevice: 'IoT Edge device'
  },
  deviceType: {
    simulated: 'Simulated',
    physical: 'Real'
  },
  authenticationType: {
    symmetricKey: 'Symmetric key',
    x509: 'X.509'
  },
  authenticationKey: {
    autoKey: 'Auto generate keys',
    manualKey: 'Enter keys manually'
  }
};

export default Config;
