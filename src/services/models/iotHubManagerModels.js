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
    'properties.reported.type': 'type',
    'properties.reported.firmware': 'firmware',
    'properties.reported.telemetry': 'telemetry',
    'c2DMessageCount': 'c2DMessageCount',
    'enabled': 'enabled',
    'lastStatusUpdated': 'lastStatusUpdated',
    'iotHubHostName': 'iotHubHostName',
    'eTag': 'eTag'
  }));
