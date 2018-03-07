// Copyright (c) Microsoft. All rights reserved.

import { reshape } from 'utilities';

export const toRulesModel = (response = {}) => (response.items || []).map(toRuleModel);

export const toRuleModel = (device = {}) => reshape(device, {
  'id': 'id',
  'conditions': 'conditions',
  'dateCreated': 'dateCreated',
  'dateModified': 'dateModified',
  'description': 'description',
  'eTag': 'eTag',
  'enabled': 'enabled',
  'groupId': 'groupId',
  'name': 'name',
  'severity': 'severity',
  'action.type': 'type'
});

export const toAlarmsModel = (response = {}) => (response.items || []).map(toAlarmModel);

export const toAlarmModel = (alarm = {}) => reshape(alarm, {
  'id': 'id',
  'dateCreated': 'dateCreated',
  'dateModified': 'dateModified',
  'description': 'description',
  'deviceId': 'deviceId',
  'eTag': 'eTag',
  'enabled': 'enabled',
  'groupId': 'groupId',
  'status': 'status',
  'rule.id': 'ruleId'
});
