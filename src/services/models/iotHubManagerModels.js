// Copyright (c) Microsoft. All rights reserved.

// Contains methods for converting service response
// object to UI friendly objects
// TODO: Map to backend models and add links to github

export const toDevicesModel = (response = {}) => (response.Items || []).map(toDeviceModel);

export const toDeviceModel = (response = {}) => {
  const reportedProperties = ((response.Properties || {}).Reported || {});
  return {
    id: response.Id,
    lastActivity: response.LastActivity,
    connected: response.Connected,
    isSimulated: response.IsSimulated,
    type: reportedProperties.Type,
    firmware: reportedProperties.Firmware,
    telemetry: reportedProperties.Telemetry,
    c2dMessageCount: response.C2DMessageCount,
    enabled: response.Enabled,
    lastStatusUpdated: response.LastStatusUpdated,
    iotHubHostName: response.IoTHubHostName,
    eTag: response.ETag
  }
};
