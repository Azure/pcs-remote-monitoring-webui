// Copyright (c) Microsoft. All rights reserved.

import { Observable } from 'rxjs';

import Config from 'app.config';
import { HttpClient } from 'utilities/httpClient';
import { toDeviceModelSelectOptions, toDeviceSimulationModel, toDeviceSimulationRequestModel } from './models';

const ENDPOINT = Config.serviceUrls.deviceSimulation;
const SIMULATION_ID = Config.simulationId;

/**
 * Contains methods for calling the device simulation microservice
 */
export class DeviceSimulationService {

  /**
   * Returns a list of devicemodels
   */
  static getDeviceModelSelectOptions() {
    return HttpClient.get(`${ENDPOINT}devicemodels`)
      .map(toDeviceModelSelectOptions);
  }

  /**
   * Get the list of running simulated devices
   */
  static getSimulatedDevices() {
    return HttpClient.get(`${ENDPOINT}simulations/${SIMULATION_ID}`)
      .map(toDeviceSimulationModel);
  }

  /**
   * Updates simulated device
   */
  static updateSimulatedDevices(simulation) {
    return HttpClient.put(`${ENDPOINT}simulations/${SIMULATION_ID}`, simulation)
      .map(toDeviceSimulationModel)
  }

  /**
   * Toggles simulation status
   */
  static toggleSimulation(Etag, Enabled) {
    return HttpClient.patch(`${ENDPOINT}simulations/${SIMULATION_ID}`, { Etag, Enabled })
      .map(toDeviceSimulationModel);
  }

  /**
   * Gets the simulated device models, increments the given one, then updates on the server
   */
  static incrementSimulatedDeviceModel(deviceModelId, increment) {
    return DeviceSimulationService.getSimulatedDevices()
      .flatMap(simulations =>
        Observable.from(simulations.deviceModels)
          .reduce(
            (acc, { id, count }) => ({
              ...acc,
              [id]: {
                id,
                count: ((acc[id] || {}).count || 0) + count
              }
            }),
            { [deviceModelId]: { id: deviceModelId, count: increment } }
          )
          .map(deviceModels => ({ ...simulations, deviceModels: Object.values(deviceModels) }))
      )
      .flatMap(simulation => DeviceSimulationService.updateSimulatedDevices(toDeviceSimulationRequestModel(simulation)));
  }
}
