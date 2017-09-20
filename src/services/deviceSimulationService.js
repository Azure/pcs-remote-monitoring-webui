// Copyright (c) Microsoft. All rights reserved.

import Http from '../common/httpClient';
import Config from '../common/config';

/**
 * Contains methods for calling the device simulation microservice
 */
class DeviceSimulationService {

  static ENDPOINT = Config.deviceSimulationApiUrl;

  /**
   * Get the list of supported simulated device models
   */
  static getDevicemodels() {
    return Http.get(`${DeviceSimulationService.ENDPOINT}devicemodels`)
      .then(data => data.Items);
  }

  /**
   * Get the list of running simulated devices
   */
  static getSimulatedDevices() {
    return Http.get(`${DeviceSimulationService.ENDPOINT}simulations/1`);
  }

  /**
   * Creates new simulated devices
   * 
   * @param {string} Id The device model Id to be created
   * @param {string} count The number of simulated devices to create
   */
  static createSimulatedDevices(Id, count) {
    return DeviceSimulationService.getSimulatedDevices()
      .then(simulations => {
          const DeviceModels = simulations.DeviceModels.reduce(
            (deviceAccumulator, currDevice) => {
              if (currDevice.Id === Id) {
                deviceAccumulator[0].Count += currDevice.Count;
              } else {
                deviceAccumulator.push(currDevice);
              }
              return deviceAccumulator;
            }, 
            [{ Id, Count: parseInt(count, 10) }] // Default new device
          );
          return Http.put(
            `${DeviceSimulationService.ENDPOINT}simulations/1`,
            { ...simulations, DeviceModels }
          );
      });
  }

}

export default DeviceSimulationService;
