// Copyright (c) Microsoft. All rights reserved.

import Http from './httpClient';
import Config from './config';
import _ from 'lodash';
import { typeComputation } from './utils';

function getGroupData(group) {
  const data = {
    id: group.id,
    displayName: group.displayName,
    eTag: group.eTag
  };
  data.conditions = _.cloneDeep(group.conditions) || [];
  data.conditions.forEach(cond => {
    if (cond.type === 'string') {
      cond.value = '"' + cond.value + '"';
    }
    delete cond.type;
  });
  return data;
}

class ApiService {
  static getAllMessages() {
    return Http.get(`${Config.telemetryApiUrl}messages`);
  }

  static getAllDevices() {
    return Http.get(`${Config.iotHubManagerApiUrl}devices`);
  }

  static getDevicesForGroup(selectedGroupConditions) {
    const encodedParam = encodeURIComponent(JSON.stringify(selectedGroupConditions));
    return Http.get(`${Config.iotHubManagerApiUrl}devices?query=${encodedParam}`);
  }

  static getAlarmsList(from, to, deviceIds) {
    return Http.get(
      `${Config.telemetryApiUrl}alarms?devices=${deviceIds}&from=` +
        encodeURIComponent(from) +
        '&to=' +
        encodeURIComponent(to)
    );
  }

  static getAlarmsListForDeviceMap(deviceIds) {
    return Http.get(`${Config.telemetryApiUrl}alarms?devices=${deviceIds}&from=NOW-PT30M&to=NOW`);
  }

  static loadTelemetryMessagesByDeviceIds(deviceIds) {
    const csvIds = deviceIds.reduce((prevStr, id) => {
      return (prevStr ? prevStr + ',' : '') + encodeURIComponent(id);
    });
    return Http.get(`${Config.telemetryApiUrl}messages?devices=${csvIds}`);
  }

  static getTelemetryMessageByDeviceIdP1M(deviceId) {
    return Http.get(
      `${Config.telemetryApiUrl}messages?from=NOW-PT1M&to=NOW&order=desc&devices=${encodeURIComponent(deviceId)}`
    );
  }

  static loadTelemetryMessages() {
    return Http.get(`${Config.telemetryApiUrl}messages?order=desc`);
  }

  static getTelemetryMessagesP1M() {
    return Http.get(`${Config.telemetryApiUrl}messages?from=NOW-PT1M&to=NOW&order=desc`);
  }

  static getAlarmsByRuleForKpi(from, to, deviceIds) {
    return Http.get(
      `${Config.telemetryApiUrl}alarmsbyrule?devices=${deviceIds}&Order=desc&from=` +
        encodeURIComponent(from) +
        '&to=' +
        encodeURIComponent(to)
    );
  }

  static getAlarmList() {
    return Http.get(`${Config.telemetryApiUrl}alarmsbyrule`);
  }

  static getRuleList() {
    return Http.get(`${Config.telemetryApiUrl}rules`);
  }

  static updateRule(id, rule) {
    return Http.put(`${Config.telemetryApiUrl}rules/${id}`, rule);
  }

  static deleteRule(id) {
    return Http.delete(`${Config.telemetryApiUrl}rules/${id}`);
  }

  /**
   * Get list of alarms aggregated by rule
   *
   * @param params An object containing API parameters
   *    "from": The ISO8601 format start of the time window for the query.
   *    "to": The ISO8601 format end of the time window for the query.
   *    "order": Whether to sort the result from the oldest (asc) or the most recent (desc)
   *    "skip": How many records to skip, used to paginate through the global list of alarms
   *    "limit": How many records to return, used to paginate through the global list of alarms
   *    "devices": A filter used to request alarms for specific devices
   */
  static getAlarmsByRule(params = {}) {
    return Http.get(`${Config.telemetryApiUrl}alarmsbyrule?${ApiService.serializeParamObject(params)}`);
  }

  static getAlarmListByRule(id, params = {}) {
      return Http.get(`${Config.telemetryApiUrl}alarmsbyrule/${id}?${ApiService.serializeParamObject(params)}`);
  }

  static getRegionByDisplayName() {
    return Http.get(`${Config.uiConfigApiUrl}devicegroups`).then(data => {
      if (data && data.items) {
        data.items.forEach(group => {
          const conditions = group.conditions || [];
          conditions.forEach(typeComputation);
        });
      }
      return data;
    });
  }

  static updateManageFiltersFlyout(group) {
    if (!group) {
      throw new Error('expected valid group object');
    }
    const data = getGroupData(group);

    return Http.put(`${Config.uiConfigApiUrl}devicegroups/${group.id}`, data);
  }

  static postManageFiltersFlyout(group) {
    if (!group) {
      throw new Error('expected valid group object');
    }
    const data = getGroupData(group);
    return Http.post(`${Config.uiConfigApiUrl}devicegroups`, data);
  }

  static updateDeviceTagValue(device, newTagValueMap) {
    if (!device) {
      throw new Error('expected valid group object');
    }
    const escapedId = encodeURIComponent(device.Id);
    const data = {
      Id: device.Id,
      Etag: device.Etag,
      tags: {
        ...device.tags,
        ...newTagValueMap
      }
    };
    return Http.put(`${Config.iotHubManagerApiUrl}devices/${escapedId}`, data);
  }

  static deleteManageFiltersFlyout(group) {
    if (!group) {
      throw new Error('expected valid group object');
    }
    return Http.delete(`${Config.uiConfigApiUrl}devicegroups/${group.id}`);
  }

  static serializeParamObject(params) {
    return Object.keys(params)
      .map(
        param =>
          `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`
      )
      .join('&');
  }

  static createRule(rule) {
    return Http.post(`${Config.telemetryApiUrl}rules`, rule);
  }

  static scheduleJobs(payload) {
    return Http.post(`${Config.iotHubManagerApiUrl}jobs`, payload);
  }
}

export default ApiService;
