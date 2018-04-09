// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { HttpClient } from './httpClient';
import { toSimulationStatusModel } from './models';

const ENDPOINT = Config.serviceUrls.deviceSimulation;
const SIMULATION_ID = Config.simulationId;

/**
 * Contains methods for calling the device simulation microservice
 */
export class DeviceSimulationService {

  /**
   * Toggles simulation status
   */
  static toggleSimulation(Etag, Enabled) {
    return HttpClient.patch(`${ENDPOINT}simulations/${SIMULATION_ID}`, { Etag, Enabled })
      .map(toSimulationStatusModel);
  }

  /**
   * Get the list of running simulated devices
   */
  static getSimulatedDevices() {
    return HttpClient.get(`${ENDPOINT}simulations/${SIMULATION_ID}`)
      .map(toSimulationStatusModel);
  }
}
