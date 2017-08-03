import Http from './httpClient';
import Config from './config';

class ApiService {
  static getAllMessages() {
    return Http.get(`${Config.telemetryApiUrl_new}/messages`);
  }

  static getAllDevices() {
    return Http.get(`${Config.iotHubManagerApiUrl_new}/devices`);
  }

  static getTelemetryMessages() {
    return Http.get(`${Config.telemetryApiUrl_new}/messages`);
  }

  static getAlarmList() {
    return Http.get(`${Config.telemetryApiUrl_new}/alarmsbyrule`);
  }
}

export default ApiService;
