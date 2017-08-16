import Http from './httpClient';
import Config from './config';

class ApiService {
  static getAllDevices() {
    return Http.get(`${Config.iotHubManagerApiUrl_new}/devices`);
  }

  static loadTelemetryMessagesByDeviceIds(deviceIds) {
    var csvIds = deviceIds.reduce((prevStr, id) => {
      return (prevStr ? prevStr + ',' : '') + encodeURIComponent(id);
    });
    return Http.get(`${Config.telemetryApiUrl_new}messages?devices=${csvIds}`);
  }

  static getLastTelemetryMessage(deviceId) {
    return Http.get(
      `${Config.telemetryApiUrl_new}messages?order=desc&limit=1&devices=${encodeURIComponent(
        deviceId
      )}`
    );
  }

  static loadTelemetryMessages() {
    return Http.get(`${Config.telemetryApiUrl_new}messages?order=desc`);
  }

  static getTelemetryMessagesP1M() {
    return Http.get(
      `${Config.telemetryApiUrl_new}messages?from=NOW-PT1M&to=NOW&order=desc`
    );
  }

  static getAlarmList() {
    return Http.get(`${Config.telemetryApiUrl_new}alarmsbyrule`);
  }

  static getRegionByDisplayName() {
    return Http.get(`${Config.uiConfigApiUrl_new}devicegroups`);
  }
}

export default ApiService;
