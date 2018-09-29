// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import moment from 'moment';
import { schema, normalize } from 'normalizr';
import update from 'immutability-helper';
import dot from 'dot-object';
import { createSelector } from 'reselect';
import { IoTHubManagerService } from 'services';
import { getActiveDeviceGroupId, getActiveDeviceGroupConditions } from './appReducer';
import {
  createReducerScenario,
  createEpicScenario,
  errorPendingInitialState,
  pendingReducer,
  errorReducer,
  setPending,
  resetPendingAndErrorReducer,
  getPending,
  getError,
  toActionCreator
} from 'store/utilities';

// ========================= Epics - START
const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

const getDeployedDeviceIds = (payload) => {
  return Object.keys(dot.pick('deviceStatuses', payload))
    .map(id => `'${id}'`)
    .join();
}
const createEdgeAgentQuery = (ids) => `"deviceId IN [${ids}] AND moduleId = '$edgeAgent'"`;
const createDevicesQuery = (ids) => `"deviceId IN [${ids}]"`;

export const epics = createEpicScenario({
  /** Loads all Deployments */
  fetchDeployments: {
    type: 'DEPLOYMENTS_FETCH',
    epic: fromAction =>
      IoTHubManagerService.getDeployments()
        .map(toActionCreator(redux.actions.updateDeployments, fromAction))
        .catch(handleError(fromAction))
  },
  /** Loads a single Deployment */
  fetchDeployment: {
    type: 'DEPLOYMENT_DETAILS_FETCH',
    epic: fromAction => IoTHubManagerService.getDeployment(fromAction.payload)
      .flatMap(response => [
        toActionCreator(redux.actions.updateDeployment, fromAction)(response),
        epics.actions.fetchDeployedDevices(response)
      ])
      .catch(handleError(fromAction))
  },
  /** Loads the queried edgeAgents and devices */
  fetchDeployedDevices: {
    type: 'DEPLOYED_DEVICES_FETCH',
    epic: fromAction => Observable
      .forkJoin(
        IoTHubManagerService.getEdgeAgentsByQuery(createEdgeAgentQuery(getDeployedDeviceIds(fromAction.payload))),
        IoTHubManagerService.getDevicesByQuery(createDevicesQuery(getDeployedDeviceIds(fromAction.payload))),
      )
      .map(toActionCreator(redux.actions.updateDeployedDevices, fromAction))
      .catch(handleError(fromAction))
  },
  /** Create a new deployment */
  createDeployment: {
    type: 'DEPLOYMENTS_CREATE',
    epic: fromAction =>
      IoTHubManagerService.createDeployment(fromAction.payload)
        .map(toActionCreator(redux.actions.insertDeployment, fromAction))
        .catch(handleError(fromAction))
  },
  /** Delete deployment */
  deleteDeployment: {
    type: 'DEPLOYMENTS_DELETE',
    epic: fromAction =>
      IoTHubManagerService.deleteDeployment(fromAction.payload)
        .map(toActionCreator(redux.actions.deleteDeployment, fromAction))
        .catch(handleError(fromAction))
  }
});
// ========================= Epics - END

// ========================= Schemas - START
const deploymentSchema = new schema.Entity('deployments');
const deploymentListSchema = new schema.Array(deploymentSchema);
const deployedDevicesSchema = new schema.Entity('deployedDevices');
const deployedDevicesListSchema = new schema.Array(deployedDevicesSchema);
// ========================= Schemas - END

// ========================= Reducers - START
const initialState = { ...errorPendingInitialState, entities: {} };

const insertDeploymentReducer = (state, { payload, fromAction }) => {
  const { entities: { deployments }, result } = normalize({ ...payload, isNew: true }, deploymentSchema);
  if (state.entities) {
    return update(state, {
      entities: { deployments: { $merge: deployments } },
      items: { $splice: [[0, 0, result]] },
      ...setPending(fromAction.type, false)
    });
  }
  return update(state, {
    entities: { deployments: { $set: deployments } },
    items: { $set: [result] },
    ...setPending(fromAction.type, false)
  });
};

const deleteDeploymentReducer = (state, { payload, fromAction }) => {
  const idx = state.items.indexOf(payload);
  return update(state, {
    entities: { deployments: { $unset: [payload] } },
    items: { $splice: [[idx, 1]] },
    ...setPending(fromAction.type, false)
  });
};

const updateDeploymentsReducer = (state, { payload, fromAction }) => {
  const { entities: { deployments }, result } = normalize(payload, deploymentListSchema);
  return update(state, {
    entities: { deployments: { $set: deployments } },
    items: { $set: result },
    lastUpdated: { $set: moment() },
    ...setPending(fromAction.type, false)
  });
};

const updateDeploymentReducer = (state, { payload, fromAction }) => {
  const { deviceStatuses } = payload || {};
  return update(state, {
    currentDeployment: { $set: payload },
    deviceStatuses: { $set: deviceStatuses },
    currentDeploymentLastUpdated: { $set: moment() },
    ...setPending(fromAction.type, false)
  });
};

const updateDeployedDevicesReducer = (state, { payload: [modules, devices], fromAction }) => {
  const normalizedDevices = normalize(devices, deployedDevicesListSchema).entities.deployedDevices;
  const normalizedModules = normalize(modules, deployedDevicesListSchema).entities.deployedDevices;
  const deployedDevices = Object.keys(normalizedDevices)
    .reduce(
      (acc, deviceId) => ({
        ...acc,
        [deviceId]: {
          ...(acc[deviceId] || {}),
          firmware: normalizedDevices[deviceId].firmware
        }
      }),
      normalizedModules
    );
  return update(state, {
    entities: {
      deployedDevices: { $set: deployedDevices }
    },
    ...setPending(fromAction.type, false)
  });
};

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchDeployment,
  epics.actionTypes.fetchDeployments,
  epics.actionTypes.createDeployment,
  epics.actionTypes.deleteDeployment,
  epics.actionTypes.fetchDeployedDevices
];

export const redux = createReducerScenario({
  insertDeployment: { type: 'DEPLOYMENT_INSERT', reducer: insertDeploymentReducer },
  deleteDeployment: { type: 'DEPLOYMENTS_DELETE', reducer: deleteDeploymentReducer },
  updateDeployments: { type: 'DEPLOYMENTS_UPDATE', reducer: updateDeploymentsReducer },
  updateDeployment: { type: 'DEPLOYMENTS_DETAILS_UPDATE', reducer: updateDeploymentReducer },
  updateDeployedDevices: { type: 'DEPLOYED_DEVICES_UPDATE', reducer: updateDeployedDevicesReducer },
  registerError: { type: 'DEPLOYMENTS_REDUCER_ERROR', reducer: errorReducer },
  resetPendingAndError: { type: 'DEPLOYMENTS_REDUCER_RESET_ERROR_PENDING', reducer: resetPendingAndErrorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer }
});

export const reducer = { deployments: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getDeploymentsReducer = state => state.deployments;
export const getEntities = state => getDeploymentsReducer(state).entities || {};
export const getDeploymentsEntities = state => getEntities(state).deployments || {};
export const getItems = state => getDeploymentsReducer(state).items || [];
export const getDeploymentsLastUpdated = state => getDeploymentsReducer(state).lastUpdated;
export const getDeploymentsError = state =>
  getError(getDeploymentsReducer(state), epics.actionTypes.fetchDeployments);
export const getDeploymentsPendingStatus = state =>
  getPending(getDeploymentsReducer(state), epics.actionTypes.fetchDeployments);
export const getCreateDeploymentError = state =>
  getError(getDeploymentsReducer(state), epics.actionTypes.createDeployment);
export const getCreateDeploymentPendingStatus = state =>
  getPending(getDeploymentsReducer(state), epics.actionTypes.createDeployment);
export const getDeleteDeploymentError = state =>
  getError(getDeploymentsReducer(state), epics.actionTypes.deleteDeployment);
export const getDeleteDeploymentPendingStatus = state =>
  getPending(getDeploymentsReducer(state), epics.actionTypes.deleteDeployment);
export const getDeployments = createSelector(
  getDeploymentsEntities, getItems, getActiveDeviceGroupId, getActiveDeviceGroupConditions,
  (deployments, items, deviceGroupId, deviceGroupConditions = []) =>
    items.reduce((acc, id) => {
      const deployment = deployments[id];
      const activeDeviceGroup = deviceGroupConditions.length > 0 ? deviceGroupId : false;
      return ((deployment && deployment.deviceGroupId && deployment.deviceGroupId === activeDeviceGroup) || !activeDeviceGroup)
        ? [...acc, deployment]
        : acc
    }, [])
);
export const getCurrentDeploymentDetails = state => getDeploymentsReducer(state).currentDeployment || {};
export const getCurrentDeploymentLastUpdated = state => getDeploymentsReducer(state).currentDeploymentLastUpdated;
export const getDeviceStatuses = state => getDeploymentsReducer(state).deviceStatuses || {};
export const getCurrentDeploymentDetailsPendingStatus = state =>
  getPending(getDeploymentsReducer(state), epics.actionTypes.fetchDeployment);
export const getCurrentDeploymentDetailsError = state =>
  getError(getDeploymentsReducer(state), epics.actionTypes.fetchDeployment);
export const getDeployedDevicesEntities = state => getEntities(state).deployedDevices || {};
export const getDeployedDevicesPendingStatus = state =>
  getPending(getDeploymentsReducer(state), epics.actionTypes.fetchDeployedDevices);
export const getDeployedDevicesError = state =>
  getError(getDeploymentsReducer(state), epics.actionTypes.fetchDeployedDevices);
export const getDeployedDevices = createSelector(
  getDeployedDevicesEntities, getDeviceStatuses,
  (DeployedDevicesEntities, deviceStatuses) =>
    Object.values(Object.keys(deviceStatuses).reduce((acc, deviceId) => ({
      ...acc,
      [deviceId]: {
        ...(acc[deviceId] || {}),
        deploymentStatus: deviceStatuses[deviceId]
      }
    }), DeployedDevicesEntities))
);
// ========================= Selectors - END
