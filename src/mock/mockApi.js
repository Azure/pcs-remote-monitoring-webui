import Http from '../common/httpClient';
import Config from '../common/config';
import alarmList from './alarms';

const messages = [
  {
    DeviceId: 'Elevator1',
    Time: '2017-01-14T05:39:45+00:00',
    telemetry: {
      Temperature: 74,
      t_unit: 'F',
      Humidity: 50,
      Vibration: 3
    }
  },
  {
    DeviceId: 'Elevator2',
    Time: '2017-01-14T11:13:04+00:00',
    telemetry: {
      Temperature: 74,
      Humidity: 50,
      Vibration: 3
    }
  },
  {
    DeviceId: 'Elevator3',
    Time: '2017-01-15T19:04:25+00:00',
    telemetry: {
      Temperature: 74,
      Humidity: 50,
      Vibration: 3
    }
  }
];

class MockApi {
  static getAllMessages() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([...messages]);
      }, 0);
    });
  }

  static getTelemetryTypes() {
    return Http.get(`${Config.telemetryTypeApiUrl}`);
  }

  static getDeviceGroup() {
    return Http.get(`${Config.deviceGroupApiUrl}`);
  }

  static getAlarmList() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(alarmList);
      }, 0);
    });
  }
}

export default MockApi;
