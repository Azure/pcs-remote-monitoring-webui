// Copyright (c) Microsoft. All rights reserved.

// Contains methods for converting service response
// object to UI friendly objects
// TODO: Map to backend models and add links to github

export const toDevicesModel = (response = {}) => (response.Items || []).map(toDeviceModel);

export const toDeviceModel = (response = {}) => ({
  eTag: response.ETag,
  id: response.Id,
  c2dMessageCount: response.C2DMessageCount,
  connected: response.Connected,
  enabled: response.Enabled,
  lastStatusUpdated: response.LastStatusUpdated,
  iotHubHostName: response.IoTHubHostName,
  isSimulated: response.IsSimulated
  //TODO: Add more complicated parts of the model
});
