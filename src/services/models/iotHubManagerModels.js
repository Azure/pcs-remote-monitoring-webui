// Copyright (c) Microsoft. All rights reserved.

import update from 'immutability-helper';
import dot from 'dot-object';
import { camelCaseReshape, getItems } from 'utilities';

// Contains methods for converting service response
// object to UI friendly objects

export const toDevicesModel = (response = {}) => getItems(response)
  .map(toDeviceModel);

export const toDeviceModel = (device = {}) => {
  const modelData = camelCaseReshape(device, {
    'id': 'id',
    'lastActivity': 'lastActivity',
    'connected': 'connected',
    'isSimulated': 'isSimulated',
    'properties.reported.firmware': 'firmware',
    'properties.reported.supportedMethods': 'methods',
    'properties.reported.telemetry': 'telemetry',
    'properties.reported.type': 'type',
    'c2DMessageCount': 'c2DMessageCount',
    'enabled': 'enabled',
    'lastStatusUpdated': 'lastStatusUpdated',
    'iotHubHostName': 'iotHubHostName',
    'eTag': 'eTag',
    'authentication': 'authentication'
  });
  return update(modelData, {
    tags: { $set: device.Tags || {} },
    properties: {
      $set: update(dot.pick('Properties.Reported', device), {
        $unset: ['Telemetry', 'SupportedMethods']
      })
    }
  });
}

export const toJobsModel = (response = []) => response.map(job => camelCaseReshape(job, {
  'jobId': 'jobId',
  'createdTimeUtc': 'createdTimeUtc',
  'endTimeUtc': 'endTimeUtc',
  'maxExecutionTimeInSeconds': 'maxExecutionTimeInSeconds',
  'methodParameter.name': 'methodName',
  'queryCondition': 'queryCondition',
  'resultStatistics.deviceCount': 'stats.deviceCount',
  'resultStatistics.failedCount': 'stats.failedCount',
  'resultStatistics.pendingCount': 'stats.pendingCount',
  'resultStatistics.runningCount': 'stats.runningCount',
  'resultStatistics.succeededCount': 'stats.succeededCount',
  'startTimeUtc': 'startTimeUtc',
  'status': 'status',
  'type': 'type'
}));

export const toJobStatusModel = (response = {}) => camelCaseReshape(response, {
  'createdTimeUtc': 'createdTimeUtc',
  'devices': 'devices',
  'endTimeUtc': 'endTimeUtc',
  'jobId': 'jobId',
  'maxExecutionTimeInSeconds': 'maxExecutionTimeInSeconds',
  'methodParameter.name': 'methodName',
  'queryCondition': 'queryCondition',
  'startTimeUtc': 'startTimeUtc',
  'status': 'status',
  'type': 'type'
});

export const AuthenticationTypeOptions = {
  symmetric: 0,
  x509: 1
};

export const toNewDeviceRequestModel = ({
  count,
  deviceId,
  isGenerateId,
  isSimulated,
  deviceModel,
  authenticationType,
  isGenerateKeys,
  primaryKey,
  secondaryKey
}) => {
  const isX509 = authenticationType === AuthenticationTypeOptions.x509;

  return {
    Id: isGenerateId ? '' : deviceId,
    IsSimulated: isSimulated,
    Authentication:
      isGenerateKeys
        ? {}
        : {
          AuthenticationType: authenticationType,
          PrimaryKey: isX509 ? null : primaryKey,
          SecondaryKey: isX509 ? null : secondaryKey,
          PrimaryThumbprint: isX509 ? primaryKey : null,
          SecondaryThumbprint: isX509 ? secondaryKey : null
        }
  };
}
