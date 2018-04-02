// Copyright (c) Microsoft. All rights reserved.

import { reshape } from 'utilities';

// Contains methods for converting service response
// object to UI friendly objects
// TODO: Map to backend models and add links to github

export const toDevicesModel = (response = {}) => (response.items || [])
  .map((device = {}) => reshape(device, {
    'id': 'id',
    'lastActivity': 'lastActivity',
    'connected': 'connected',
    'isSimulated': 'isSimulated',
    'properties.reported.firmware': 'firmware',
    'properties.reported.supportedMethods': 'methods',
    'properties.reported.telemetry': 'telemetry',
    'properties.reported.type': 'type',
    'properties.reported': 'properties',
    'c2DMessageCount': 'c2DMessageCount',
    'enabled': 'enabled',
    'lastStatusUpdated': 'lastStatusUpdated',
    'iotHubHostName': 'iotHubHostName',
    'eTag': 'eTag',
    'tags': 'tags'
  }));

export const toJobsModel = (response = []) => response.map(job => reshape(job, {
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

export const toJobStatusModel = (response = {}) => reshape(response, {
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
