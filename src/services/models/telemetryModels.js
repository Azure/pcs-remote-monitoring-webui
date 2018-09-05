// Copyright (c) Microsoft. All rights reserved.

import { camelCaseReshape, getItems } from 'utilities';
import update from 'immutability-helper';

export const ruleCalculations = ['Average', 'Instant'];

// Represented in milliSeconds (label is minutes, value is milliseconds)
export const ruleTimePeriods = [
  { label: '1', value: '60000' },
  { label: '5', value: '300000' },
  { label: '10', value: '600000' }
];

export const getRuleTimePeriodLabel = (value) => {
  const timePeriod = ruleTimePeriods.find(item => item.value === value);
  return (timePeriod || {}).label || value;

};

export const ruleOperators = [
  { label: '>', value: 'GreaterThan' },
  { label: '>=', value: 'GreaterThanOrEqual' },
  { label: '<', value: 'LessThan' },
  { label: '<=', value: 'LessThanOrEqual' },
  { label: '=', value: 'Equals' }
];

export const getRuleOperatorLabel = (value) => {
  const operator = ruleOperators.find(item => item.value === value);
  return (operator || {}).label || value;
};

export const toRulesModel = (response = {}) => getItems(response)
  .map(toRuleModel);

export const toRuleModel = (response = {}) => {
  const model = camelCaseReshape(response, {
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
    'action.type': 'type',
    'deleted': 'deleted'
  });
  return update(model, {
    severity: { $set: (model.severity || '').toLowerCase() },
    status: { $set: (model.deleted ? 'Deleted' : model.enabled ? 'Enabled' : 'Disabled')}
  });
};

// TODO: Double check the response from alertsByRule and alerts, might only need one model
export const toAlertsModel = (response = {}) => getItems(response)
  .map((alert = {}) => {
    const model = camelCaseReshape(alert, {
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
    });
    return update(model, {
      severity: { $set: (model.severity || '').toLowerCase() },
      status: { $set: (model.status || '').toLowerCase() }
    });
  });

export const toActiveAlertsModel = (response = {}) => getItems(response)
  .map((alert = {}) => {
    const model = camelCaseReshape(alert, {
      'rule.id': 'ruleId',
      'count': 'count',
      'created': 'created',
      'status': 'status',
      'rule.severity': 'severity',
      'rule.description': 'description'
    });
    return update(model, {
      severity: { $set: (model.severity || '').toLowerCase() },
      status: { $set: (model.status || '').toLowerCase() }
    });
  });

export const toAlertsForRuleModel = (response = {}) => getItems(response)
  .map(toAlertForRuleModel);

export const toAlertForRuleModel = (alert = {}) => {
  const model = camelCaseReshape(alert, {
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
  return update(model, {
    status: { $set: (model.status || '').toLowerCase() }
  });
};

export const toMessagesModel = (response = {}) => getItems(response)
  .map((message = {}) => camelCaseReshape(message, {
    'data': 'data',
    'deviceId': 'deviceId',
    'time': 'time'
  }));

export const toEditRuleRequestModel = ({
  id,
  name,
  description,
  groupId,
  conditions,
  severity,
  enabled,
  calculation,
  timePeriod,
  eTag
}) => {
  const Conditions = conditions.map(condition => ({
    Field: condition.field,
    Operator: condition.operator,
    Value: condition.value
  }));
  return {
    Id: id,
    Name: name,
    Description: description,
    GroupId: groupId,
    Severity: severity,
    Enabled: enabled,
    Calculation: calculation,
    TimePeriod: timePeriod,
    ETag: eTag,
    Conditions
  };
}
