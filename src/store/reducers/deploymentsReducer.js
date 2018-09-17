// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import moment from 'moment';
import { schema, normalize } from 'normalizr';
import update from 'immutability-helper';
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

export const epics = createEpicScenario({
  /** Loads Deployments */
  fetchDeployments: {
    type: 'DEPLOYMENTS_FETCH',
    epic: fromAction =>
      IoTHubManagerService.getDeployments()
        .map(toActionCreator(redux.actions.updateDeployments, fromAction))
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
// ========================= Schemas - END

// ========================= Reducers - START
const initialState = { ...errorPendingInitialState, entities: {} };

const insertDeploymentReducer = (state, { payload, fromAction }) => {
  const { entities: { deployments }, result } = normalize({...payload, isNew: true}, deploymentSchema);
  if (state.entities) {
    return update(state, {
      entities: { $merge: deployments },
      items: { $splice: [[0, 0, result]] },
      ...setPending(fromAction.type, false)
    });
  }
  return update(state, {
    entities: { $set: deployments },
    items: { $set: [result] },
    ...setPending(fromAction.type, false)
  });
};

const deleteDeploymentReducer = (state, { payload, fromAction }) => {
  const idx = state.items.indexOf(payload);
  return update(state, {
    entities: { $unset: [payload] },
    items: { $splice: [[idx, 1]] },
    ...setPending(fromAction.type, false)
  });
};

const updateDeploymentsReducer = (state, { payload, fromAction }) => {
  const { entities: { deployments }, result } = normalize(payload, deploymentListSchema);
  return update(state, {
    entities: { $set: deployments },
    items: { $set: result },
    lastUpdated: { $set: moment() },
    ...setPending(fromAction.type, false)
  });
};

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchDeployments,
  epics.actionTypes.createDeployment,
  epics.actionTypes.deleteDeployment
];

export const redux = createReducerScenario({
  insertDeployment: { type: 'DEPLOYMENT_INSERT', reducer: insertDeploymentReducer },
  deleteDeployment: { type: 'DEPLOYMENTS_DELETE', reducer: deleteDeploymentReducer },
  updateDeployments: { type: 'DEPLOYMENTS_UPDATE', reducer: updateDeploymentsReducer },
  registerError: { type: 'DEPLOYMENTS_REDUCER_ERROR', reducer: errorReducer },
  resetPendingAndError: { type: 'DEPLOYMENTS_REDUCER_RESET_ERROR_PENDING', reducer: resetPendingAndErrorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer }
});

export const reducer = { deployments: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getDeploymentsReducer = state => state.deployments;
export const getEntities = state => getDeploymentsReducer(state).entities || {};
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
  getEntities, getItems, getActiveDeviceGroupId, getActiveDeviceGroupConditions,
  (entities, items, deviceGroupId, deviceGroupConditions = []) =>
    items.reduce((acc, id) => {
      const deployment = entities[id];
      const activeDeviceGroup = deviceGroupConditions.length > 0 ? deviceGroupId : false;
      return (deployment.deviceGroupId === activeDeviceGroup || !activeDeviceGroup)
        ? [...acc, deployment]
        : acc
    }, [])
);
// ========================= Selectors - END
