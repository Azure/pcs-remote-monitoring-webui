import Http from './httpClient';
import Config from './config';

class ApiService {
  static getAllDevices() {
    return Http.get(`${Config.iotHubManagerApiUrl}/devices`);
  }

  static loadTelemetryMessagesByDeviceIds(deviceIds) {
    var csvIds = deviceIds.reduce((prevStr, id) => {
      return (prevStr ? prevStr + ',' : '') + encodeURIComponent(id);
    });
    return Http.get(`${Config.telemetryApiUrl}messages?devices=${csvIds}`);
  }

  static getLastTelemetryMessage(deviceId) {
    return Http.get(
      `${Config.telemetryApiUrl}messages?order=desc&limit=1&devices=${encodeURIComponent(
        deviceId
      )}`
    );
  }

  static loadTelemetryMessages() {
    return Http.get(`${Config.telemetryApiUrl}messages?order=desc`);
  }

  static getTelemetryMessagesP1M() {
    return Http.get(
      `${Config.telemetryApiUrl}messages?from=NOW-PT1M&to=NOW&order=desc`
    );
  }

  static getAlarmList() {
    return Http.get(`${Config.telemetryApiUrl}alarmsbyrule`);
  }

  /**
   * Get list of alarms aggregated by rule
   * @param params An object containing API parameters
   *    "from": The ISO8601 format start of the time window for the query.
   *    "to": The ISO8601 format end of the time window for the query.
   *    "order": Whether to sort the result from the oldest (asc) or the most recent (desc)
   *    "skip": How many records to skip, used to paginate through the global list of alarms
   *    "limit": How many records to return, used to paginate through the global list of alarms
   *    "devices": A filter used to request alarms for specific devices
   */
  static getAlarmsByRule(params = {}) {
    return Http.get(
      `${Config.telemetryApiUrl}alarmsbyrule?${ApiService.serializeParamObject(
        params
      )}`
    );
  }

  static getRegionByDisplayName() {
    return Http.get(`${Config.uiConfigApiUrl}devicegroups`);
  }

  static updateManageFiltersFlyout(group) {
    if (!group) {
      throw new Error('expected valid group object');
    }
    const data = {};
    data.id = group.id;
    data.displayName = group.displayName;
    data.conditions = group.conditions;
    data.eTag = group.eTag;
    return Http.put(`${Config.uiConfigApiUrl}devicegroups/${group.id}`, data);
  }

  static postManageFiltersFlyout(group) {
    if (!group) {
      throw new Error('expected valid group object');
    }
    const data = {};
    data.id = group.id;
    data.displayName = group.displayName;
    data.conditions = group.conditions;
    return Http.post(`${Config.uiConfigApiUrl}devicegroups`, data);
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
}

export default ApiService;
