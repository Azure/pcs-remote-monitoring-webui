// Copyright (c) Microsoft. All rights reserved.

import { toDiagnosticsModel } from 'services/models';

export const toLogRuleModel = (rule = {}) => ({
  'DeviceGroup': rule.groupId,
  'Calculation': rule.calculation,
  'TimePeriod': rule.timePeriod,
  'Severity': rule.severity
});

export const toRuleDiagnosticsModel = (eventName, rule) => toDiagnosticsModel(eventName, toLogRuleModel(rule));
