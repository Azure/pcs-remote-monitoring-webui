// Copyright (c) Microsoft. All rights reserved.

const Config = {
    solutionApiUrl: process.env.REACT_APP_UICONFIG_WEBSERVICE_URL,
    uiConfigApiUrl: process.env.REACT_APP_UICONFIG_WEBSERVICE_URL,
    deviceSimulationApiUrl: process.env.REACT_APP_DEVICESIMULATION_WEBSERVICE_URL,
    iotHubManagerApiUrl: process.env.REACT_APP_IOTHUBMANAGER_WEBSERVICE_URL,
    deviceGroupApiUrl: process.env.REACT_APP_UICONFIG_WEBSERVICE_URL + "api/v1/devicegroups/list",
    telemetryTypeApiUrl: process.env.REACT_APP_UICONFIG_WEBSERVICE_URL + "api/v1/telemetrytypes"
};

export default Config;