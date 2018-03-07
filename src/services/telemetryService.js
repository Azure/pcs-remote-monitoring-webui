// Copyright (c) Microsoft. All rights reserved.

import { stringify } from 'query-string';
import Config from 'app.config';
import { HttpClient } from './httpClient';
import { toRulesModel, toAlarmsModel } from './models';

const ENDPOINT = Config.serviceUrls.telemetry;

/** Contains methods for calling the telemetry service */
export class TelemetryService {

  /** Returns a list of rules */
  static getRules() {
    return HttpClient.get(`${ENDPOINT}rules`)
      .map(toRulesModel);
  }

  /** Returns a list of alarms created from a rule */
  static getAlarmsByRule(id, params = {}) {
    return HttpClient.get(`${ENDPOINT}alarmsbyrule/${id}?${stringify(params)}`)
      .map(toAlarmsModel);
  }
}
