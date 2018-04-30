// Copyright (c) Microsoft. All rights reserved.

import { camelCaseReshape, getItems } from 'utilities';
import update from 'immutability-helper';

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
    'action.type': 'type'
  });
  return update(model, {
    severity: { $set: (model.severity || '').toLowerCase() }
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
