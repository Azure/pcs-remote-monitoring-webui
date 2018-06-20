// Copyright (c) Microsoft. All rights reserved.

import { camelCaseReshape, reshape, getItems, stringToBoolean } from 'utilities';

export const toDeviceGroupModel = (deviceGroup = {}) => camelCaseReshape(deviceGroup, {
  'id': 'id',
  'displayName': 'displayName',
  'conditions': 'conditions',
  'eTag': 'eTag'
});

export const toDeviceGroupsModel = (response = {}) => getItems(response)
  .map(toDeviceGroupModel);

export const toCreateDeviceGroupRequestModel = (params = {}) => ({
  DisplayName: params.displayName,
  Conditions: (params.conditions || []).map(condition => reshape(condition, {
    'field': 'Key',
    'operator': 'Operator',
    'value': 'Value'
  }))
});

export const toUpdateDeviceGroupRequestModel = (params = {}) => ({
  Id: params.id,
  ETag: params.eTag,
  DisplayName: params.displayName,
  Conditions: (params.conditions || []).map(condition => reshape(condition, {
    'field': 'Key',
    'operator': 'Operator',
    'value': 'Value'
  }))
});

export const prepareLogoResponse = ({  xhr, response }) => {
  const returnObj = {};
  const isDefault = xhr.getResponseHeader('IsDefault');
  if (!stringToBoolean(isDefault)) {
    const appName = xhr.getResponseHeader('Name');
    if (appName) {
      returnObj['name'] = appName;
    }
    if (response && response.size) {
      returnObj['logo'] = URL.createObjectURL(response);
    }
  }
  return returnObj;
}

export const toSolutionSettingThemeModel = (response = {}) => camelCaseReshape(response, {
  'azureMapsKey': 'azureMapsKey',
  'description': 'description',
  'name': 'name'
});
