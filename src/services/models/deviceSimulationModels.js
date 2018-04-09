// Copyright (c) Microsoft. All rights reserved.

import { reshape } from 'utilities';

export const toSimulationStatusModel = (response = {}) => reshape(response, {
  'enabled': 'enabled',
  'etag': 'etag'
});
