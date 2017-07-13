import Http from '../common/httpClient';
import Config from '../common/config';

const message = [
  {
    DeviceId: 'Elevator1',
    Time: '2017-01-14T05:39:45+00:00',
    Body: '1,up,5.8'
  },
  {
    DeviceId: 'Elevator2',
    Time: '2017-01-14T11:13:04+00:00',
    Body: '2,up,2.2'
  },
  {
    DeviceId: 'Elevator3',
    Time: '2017-01-15T19:04:25+00:00',
    Body: '1,down,0.2'
  }
];

class MockApi {
  static getAllMessages() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([...message]);
      }, 0);
    });
  }

  static getAllDevices() {
    return Http.get(`${Config.solutionApiUrl}api/v1/devices/twin?filter=`);
  }

  static getMapKey() {
    return Http.get(`${Config.solutionApiUrl}api/v1/mapApiKey`);
  }
}

export default MockApi;
