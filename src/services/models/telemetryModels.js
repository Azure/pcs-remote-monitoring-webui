// Copyright (c) Microsoft. All rights reserved.

import { reshape } from 'utilities';

export const toRulesModel = (response = {}) => (response.items || [])
  .map((device = {}) => reshape(device, {
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
  }));

  export const toAlarmsModel = (response = {}) => (response.items || [])
  .map((alarm = {}) => reshape(alarm, {
    'rule.id': 'ruleId',
    'created': 'created',
    'status': 'status',
    'rule.severity': 'severity',
    'rule.description': 'description'
  }));

export const toActicveAlarmsModel = (response = {}) => (response.items || [])
  .map((alarm = {}) => reshape(alarm, {
    'rule.id': 'ruleId',
    'count': 'count',
    'created': 'created',
    'status': 'status',
    'rule.severity': 'severity',
    'rule.description': 'description'
  }));

export const toAlarmsForRuleModel = (response = {}) => (response.items || [])
  .map((alarm = {}) => reshape(alarm, {
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
  }));
