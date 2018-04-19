// Copyright (c) Microsoft. All rights reserved.

import { camelCaseReshape, getItems, stringToBoolean } from 'utilities';

export const toDeviceGroupsModel = (response = {}) => getItems(response)
  .map((device = {}) => camelCaseReshape(device, {
    'id': 'id',
    'displayName': 'displayName',
    'conditions': 'conditions',
    'eTag': 'eTag'
  }));

export const prepareLogoResponse = (responseWrapper) => {
  const returnObj = {};
  const xhr = responseWrapper.xhr;
  const isDefault = xhr.getResponseHeader("IsDefault");
  if (!stringToBoolean(isDefault)) {
    const appName = xhr.getResponseHeader("Name");
    if (appName) {
      returnObj['name'] = appName;
    }
    const blob = responseWrapper.response;
    if (blob && blob.size > 0) {
      returnObj['logo'] = URL.createObjectURL(blob);
    }
  }
  return returnObj;
}

export const toSolutionSettingThemeModel = (response = {}) => camelCaseReshape(response, {
  'azureMapsKey': 'azureMapsKey',
  'description': 'description',
  'name': 'name'
});
