// Copyright (c) Microsoft. All rights reserved.

import { stringify } from 'query-string';
import Config from 'app.config';
import { HttpClient } from './httpClient';
import {
  toActiveAlertsModel,
  toAlertForRuleModel,
  toAlertsForRuleModel,
  toAlertsModel,
  toMessagesModel,
  toRuleModel,
  toRulesModel
} from './models';

const ENDPOINT = Config.serviceUrls.telemetry;

/** Contains methods for calling the telemetry service */
export class TelemetryService {

  /** Returns a list of rules */
  static getRules(params = {}) {
    return HttpClient.get(`${ENDPOINT}rules?${stringify(params)}`)
      .map(toRulesModel);
  }

  /** creates a new rule */
  static createRule(rule) {
    return HttpClient.post(`${ENDPOINT}rules`, rule)
      .map(toRuleModel);
  }

  /** updates an existing rule */
  static updateRule(id, rule) {
    return HttpClient.put(`${ENDPOINT}rules/${id}`, rule)
      .map(toRuleModel);
  }

  /** Returns a list of alarms (all statuses) */
  static getAlerts(params = {}) {
    return HttpClient.get(`${ENDPOINT}alarms?${stringify(params)}`)
      .map(toAlertsModel)
  }

  /** Returns a list of active alarms (open or ack) */
  static getActiveAlerts(params = {}) {
    return HttpClient.get(`${ENDPOINT}alarmsbyrule?${stringify(params)}`)
      .map(toActiveAlertsModel);
  }

  /** Returns a list of alarms created from a given rule */
  static getAlertsForRule(id, params = {}) {
    return HttpClient.get(`${ENDPOINT}alarmsbyrule/${id}?${stringify(params)}`)
      .map(toAlertsForRuleModel);
  }

  /** Returns a list of alarms created from a given rule */
  static updateAlertStatus(id, Status) {
    return HttpClient.patch(`${ENDPOINT}alarms/${encodeURIComponent(id)}`, { Status })
      .map(toAlertForRuleModel);
  }

  /** Returns a telemetry events */
  static getTelemetryByMessages(params = {}) {
    const _params = {
      ...params,
      devices: (params.devices || []).map(encodeURIComponent).join()
    };
    return HttpClient.get(`${ENDPOINT}messages?${stringify(_params)}`)
      .map(toMessagesModel);
  }

  static getTelemetryByDeviceIdP1M(devices = []) {
    return TelemetryService.getTelemetryByMessages({
      from: 'NOW-PT1M',
      to: 'NOW',
      order: 'desc',
      devices
    });
  }

  static getTelemetryByDeviceIdP15M(devices = []) {
    return TelemetryService.getTelemetryByMessages({
      from: 'NOW-PT15M',
      to: 'NOW',
      order: 'desc',
      devices
    });
  }

}
