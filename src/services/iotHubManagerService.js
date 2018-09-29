// Copyright (c) Microsoft. All rights reserved.

import { Observable } from 'rxjs';

import Config from 'app.config';
import { stringify } from 'query-string';
import { HttpClient } from 'utilities/httpClient';
import {
  toDevicesModel,
  toDeviceModel,
  toJobsModel,
  toJobStatusModel,
  toDevicePropertiesModel,
  toDeploymentModel,
  toDeploymentsModel,
  toDeploymentRequestModel,
  toEdgeAgentsModel
} from './models';

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

  /** Submits a job */
  static submitJob(body) {
    return HttpClient.post(`${ENDPOINT}jobs`, body)
      .map(toJobStatusModel);
  }

  /** Get returns the status details for a particular job */
  static getJobStatus(jobId) {
    return HttpClient.get(`${ENDPOINT}jobs/${jobId}?includeDeviceDetails=true`)
      .map(toJobStatusModel);
  }

  /** Provisions a device */
  static provisionDevice(body) {
    return HttpClient.post(`${ENDPOINT}devices`, body)
      .map(toDeviceModel);
  }

  /** Deletes a device */
  static deleteDevice(id) {
    return HttpClient.delete(`${ENDPOINT}devices/${id}`)
      .map(() => ({ deletedDeviceId: id }));
  }

  /** Returns the account's device group filters */
  static getDeviceProperties() {
    return Observable
      .forkJoin(
        HttpClient.get(`${ENDPOINT}deviceproperties`),
        HttpClient.get(`${Config.serviceUrls.deviceSimulation}devicemodelproperties`)
      )
      .map(([iotResponse, dsResponse]) => toDevicePropertiesModel(iotResponse, dsResponse));
  }

  /** Returns deployments */
  static getDeployments() {
    return HttpClient.get(`${ENDPOINT}deployments`)
      .map(toDeploymentsModel);
  }

  /** Returns deployment */
  static getDeployment(id) {
    return HttpClient.get(`${ENDPOINT}deployments/${id}?includeDeviceStatus=true`)
      .map(toDeploymentModel);
  }

  /** Queries EdgeAgent */
  static getEdgeAgentsByQuery(query) {
    return HttpClient.post(`${ENDPOINT}modules/query`, query)
      .map(toEdgeAgentsModel);
  }

  /** Queries Devices */
  static getDevicesByQuery(query) {
    return HttpClient.post(`${ENDPOINT}devices/query`, query)
      .map(toDevicesModel);
  }

  /** Create a deployment */
  static createDeployment(deploymentModel) {
    return HttpClient.post(`${ENDPOINT}deployments`, toDeploymentRequestModel(deploymentModel))
      .map(toDeploymentModel);
  }

  /** Delete a deployment */
  static deleteDeployment(id) {
    return HttpClient.delete(`${ENDPOINT}deployments${id}`)
      .map(() => id);
  }

  /** Returns deployments */
  static getDeploymentDetails(query) {
    return HttpClient.post(`${ENDPOINT}modules`, query)
      .map(toDeploymentsModel);
  }
}
