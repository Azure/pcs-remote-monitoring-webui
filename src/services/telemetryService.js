// Copyright (c) Microsoft. All rights reserved.

import { stringify } from 'query-string';
import Config from 'app.config';
import { HttpClient } from './httpClient';
import { toRulesModel, toAlarmsModel, toAlarmsForRuleModel } from './models';

const ENDPOINT = Config.serviceUrls.telemetry;

/** Contains methods for calling the telemetry service */
export class TelemetryService {

  /** Returns a list of rules */
  static getRules(params = {}) {
    return HttpClient.get(`${ENDPOINT}rules?${stringify(params)}`)
      .map(toRulesModel);
  }

  /** Returns a list of alarms */
  static getAlarms(params = {}) {
    return HttpClient.get(`${ENDPOINT}alarmsbyrule?${stringify(params)}`)
      .map(toAlarmsModel);
  }

  /** Returns a list of alarms created from a given rule */
  static getAlarmsForRule(id, params = {}) {
    return HttpClient.get(`${ENDPOINT}alarmsbyrule/${id}?${stringify(params)}`)
      .map(toAlarmsForRuleModel);
  }
}
