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

  static getRegionByDisplayName() {
    return Http.get(`${Config.uiConfigApiUrl}devicegroups`);
  }
}

export default ApiService;
