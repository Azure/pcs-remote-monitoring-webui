// Copyright (c) Microsoft. All rights reserved.

import { camelCaseReshape, getItems } from 'utilities';

export const toRulesModel = (response = {}) => getItems(response)
  .map(toRuleModel);

export const toRuleModel = (response = {}) => camelCaseReshape(response, {
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
  'calculation': 'calculation',
  'timePeriod': 'timePeriod',
  'action.type': 'type'
});

// TODO: Double check the response from alarmsByRule and alarms, might only need one model
export const toAlarmsModel = (response = {}) => getItems(response)
  .map((alarm = {}) => camelCaseReshape(alarm, {
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

export const toActiveAlarmsModel = (response = {}) => getItems(response)
  .map((alarm = {}) => camelCaseReshape(alarm, {
    'rule.id': 'ruleId',
    'count': 'count',
    'created': 'created',
    'status': 'status',
    'rule.severity': 'severity',
    'rule.description': 'description'
  }));

export const toAlarmsForRuleModel = (response = {}) => getItems(response)
  .map((alarm = {}) => camelCaseReshape(alarm, {
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

export const toMessagesModel = (response = {}) => getItems(response)
  .map((message = {}) => camelCaseReshape(message, {
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
  enabled,
  calculation,
  timePeriod
}) => {
  const Conditions = conditions.map(condition => ({
    Field: condition.field,
    Operator: condition.operator,
    Value: condition.value
  }));
  return {
    Name: name,
    Description: description,
    GroupId: groupId,
    Severity: severity,
    Enabled: enabled,
    Calculation: calculation,
    TimePeriod: timePeriod,
    Conditions
  };
}
