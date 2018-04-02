// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { stringify } from 'query-string';
import { HttpClient } from './httpClient';
import { toDevicesModel, toJobsModel, toJobStatusModel } from './models';

const ENDPOINT = Config.serviceUrls.iotHubManager;

/** Contains methods for calling the Device service */
export class IoTHubManagerService {

  /** Returns a list of devices */
  static getDevices(conditions = []) {
    const query = encodeURIComponent(JSON.stringify(conditions));
    return HttpClient.get(`${ENDPOINT}devices?query=${query}`)
      .map(toDevicesModel);
  }

  /** Returns a list of all jobs */
  static getJobs(params) {
    return HttpClient.get(`${ENDPOINT}jobs?${stringify(params)}`)
      .map(toJobsModel);
  }

  /** Get returns the status details for a particular job */
  static getJobStatus(jobId) {
    return HttpClient.get(`${ENDPOINT}jobs/${jobId}?includeDeviceDetails=true`)
      .map(toJobStatusModel);
  }

  /** Deletes a device */
  static deleteDevice(id) {
    return HttpClient.delete(`${ENDPOINT}devices/${id}`)
      .map(() => ({ deletedDeviceId: id }));
  }
}
