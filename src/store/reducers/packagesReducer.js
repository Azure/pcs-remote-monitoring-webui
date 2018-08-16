// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import moment from 'moment';
import { schema, normalize } from 'normalizr';
import update from 'immutability-helper';
import { createSelector } from 'reselect';
import { ConfigService } from 'services';
import {
  createReducerScenario,
  createEpicScenario,
  errorPendingInitialState,
  pendingReducer,
  errorReducer,
  setPending,
  getPending,
  getError,
  toActionCreator
} from 'store/utilities';

// ========================= Epics - START
const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

export const epics = createEpicScenario({
  /** Loads Packages*/
  fetchPackages: {
    type: 'PACKAGES_FETCH',
    epic: fromAction =>
      ConfigService.getPackages()
        .map(toActionCreator(redux.actions.updatePackages, fromAction))
        .catch(handleError(fromAction))
  },
  /** Create a new package */
  createPackage: {
    type: 'PACKAGES_CREATE',
    epic: fromAction =>
      ConfigService.createPackage(fromAction.payload)
        .map(toActionCreator(redux.actions.insertPackage, fromAction))
        .catch(handleError(fromAction))
  },
  /** Delete packages */
  deletePackages: {
    type: 'PACKAGES_DELETE',
    epic: fromAction =>
      ConfigService.deletePackage(fromAction.payload)
        .map(toActionCreator(redux.actions.deletePackage, fromAction))
        .catch(handleError(fromAction))
  }
});
// ========================= Epics - END

// ========================= Schemas - START
const packageSchema = new schema.Entity('packages');
const packageListSchema = new schema.Array(packageSchema);
// ========================= Schemas - END

// ========================= Reducers - START
const initialState = { ...errorPendingInitialState, entities: {} };

const insertPackageReducer = (state, { payload }) => {
  const { entities: { packages }, result } = normalize(payload, packageListSchema);
  return update(state, {
    entities: { $merge: packages },
    items: { $splice: [[state.items.length, 0, result]] }
  });
};

const deletePackagesReducer = (state, { payload }) => {
  const spliceArr = payload.reduce((idxAcc, payloadItem) => {
    const idx = state.items.indexOf(payloadItem);
    if (idx !== -1) {
      idxAcc.push([idx, 1]);
    }
    return idxAcc;
  }, []);
  return update(state, {
    entities: { $unset: payload },
    items: { $splice: spliceArr }
  });
};

const updatePackagesReducer = (state, { payload, fromAction }) => {
  const { entities: { packages }, result } = normalize(payload, packageListSchema);
  return update(state, {
    entities: { $set: packages },
    items: { $set: result },
    lastUpdated: { $set: moment() },
    ...setPending(fromAction.type, false)
  });
};

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchPackages
];

export const redux = createReducerScenario({
  insertPackage: { type: 'PACKAGE_INSERT', reducer: insertPackageReducer },
  deletePackages: { type: 'PACKAGES_DELETE', reducer: deletePackagesReducer },
  updatePackages: { type: 'PACKAGES_UPDATE', reducer: updatePackagesReducer },
  registerError: { type: 'PACKAGES_REDUCER_ERROR', reducer: errorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer }
});

export const reducer = { packages: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getPackagesReducer = state => state.packages;
export const getEntities = state => getPackagesReducer(state).entities || {};
export const getItems = state => getPackagesReducer(state).items || [];
export const getPackagesLastUpdated = state => getPackagesReducer(state).lastUpdated;
export const getPackagesError = state =>
  getError(getPackagesReducer(state), epics.actionTypes.fetchPackages);
export const getPackagesPendingStatus = state =>
  getPending(getPackagesReducer(state), epics.actionTypes.fetchPackages);
export const getPackages = createSelector(
  getEntities, getItems,
  (entities, items) => items.map(id => entities[id])
);
// ========================= Selectors - END
