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

// TODO: Double check the response from alarmsByRule and alarms, might only need one model
export const toAlarmsModel = (response = {}) => (response.items || [])
  .map((alarm = {}) => reshape(alarm, {
    'rule.id': 'ruleId',
    'created': 'created',
    'status': 'status',
    'rule.severity': 'severity',
    'rule.description': 'ruleDescription',
    'deviceId': 'deviceId',
    'dateCreated': 'dateCreated',
    'dateModified': 'dateModified',
    'description': 'description',
    'id': 'id',
    'groupId': 'groupId'
  }));

export const toActiveAlarmsModel = (response = {}) => (response.items || [])
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

export const toMessagesModel = (response = {}) => (response.items || [])
  .map((message = {}) => reshape(message, {
    'data': 'data',
    'deviceId': 'deviceId',
    'time': 'time'
  }));

export const toNewRuleRequestModel = ({
  name,
  description,
  groupId,
  conditions,
  severity,
  enabled
}) => {
  const Conditions = conditions.map(condition => ({
    Field: condition.field,
    Operator: condition.operator,
    Calculation: condition.calculation,
    Duration: condition.duration,
    Value: condition.value
  }));
  return {
    Name: name,
    Description: description,
    GroupId: groupId,
    Severity: severity,
    Enabled: enabled,
    Conditions
  };
}
