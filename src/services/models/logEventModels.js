// Copyright (c) Microsoft. All rights reserved.

import { toDiagnosticsModel } from 'services/models';
import Config from 'app.config';

export const toRuleDiagnosticsModel = (eventName, rule) => {
  const metadata = {
    DeviceGroup: rule.groupId,
    Calculation: rule.calculation,
    TimePeriod: rule.timePeriod,
    SeverityLevel: rule.severity,
    ConditionCount: rule.conditions.length,
    FirstFieldChosen: rule.conditions[0].field,
    FirstOperatorChosen: rule.conditions[0].operator
  };

  return toDiagnosticsModel(eventName, metadata);
}

export const toSinglePropertyDiagnosticsModel = (eventName, propertyTitle, property) => {
  const metadata = { [propertyTitle]: property };
  return toDiagnosticsModel(eventName, metadata);
}

export const toDeviceDiagnosticsModel = (eventName, deviceFormData) => {
  const metadata = {
    DeviceIDType: deviceFormData.isSimulated ? '' : (deviceFormData.isGenerateId ? 'Generated' : 'Manual'),
    DeviceType: deviceFormData.isSimulated ? Config.deviceType.simulated : Config.deviceType.physical,
    NumberOfDevices: deviceFormData.count,
    DeviceModel: deviceFormData.isSimulated ? deviceFormData.deviceModel : '',
    AuthType: deviceFormData.isSimulated ? '' : (deviceFormData.authenticationType ? 'x.509' : 'Symmetric Key'),
    AuthKey: deviceFormData.isSimulated ? '' : (deviceFormData.isGenerateKeys ? 'Auto' : 'Manual')
  }
  return toDiagnosticsModel(eventName, metadata);
}
