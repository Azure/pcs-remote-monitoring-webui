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

  static loadTelemetryMessages() {
    return Http.get(`${Config.telemetryApiUrl_new}messages`);
  }

  static getAlarmList() {
    return Http.get(`${Config.telemetryApiUrl_new}alarmsbyrule`);
  }

  static getRegionByDisplayName() {
    return Http.get(`${Config.uiConfigApiUrl_new}devicegroups`);
  }
}

export default ApiService;
