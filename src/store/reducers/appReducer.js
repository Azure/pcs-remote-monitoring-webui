// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import { ConfigService, GitHubService } from 'services';
import { schema, normalize } from 'normalizr';
import { createSelector } from 'reselect';
import update from 'immutability-helper';
import { permissions } from 'services/models';
import {
  createAction,
  createReducerScenario,
  createEpicScenario,
  errorPendingInitialState,
  pendingReducer,
  errorReducer,
  setPending,
  toActionCreator,
  getPending,
  getError
} from 'store/utilities';
import { svgs, compareByProperty } from 'utilities';

// ========================= Epics - START
const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

export const epics = createEpicScenario({
  /** Initializes the redux state */
  initializeApp: {
    type: 'APP_INITIALIZE',
    epic: () => [
      epics.actions.fetchAzureMapsKey(),
      epics.actions.fetchDeviceGroups(),
      epics.actions.fetchLogo(),
      epics.actions.fetchReleaseInformation()
    ]
  },

  /** Get the account's device groups */
  fetchDeviceGroups: {
    type: 'APP_DEVICE_GROUPS_FETCH',
    epic: (fromAction, store) =>
      ConfigService.getDeviceGroups()
        .flatMap(payload => {
          const deviceGroups = payload.sort(compareByProperty('displayName', true));
          const actions = [];
          actions.push(toActionCreator(redux.actions.updateDeviceGroups, fromAction)(deviceGroups));
          // If no active device group has been selected yet, select the first one
          if (!getActiveDeviceGroupId(store.getState()))
            actions.push(toActionCreator(redux.actions.updateActiveDeviceGroup, fromAction)(deviceGroups[0].id));
          return actions;
        })
        .catch(handleError(fromAction))
  },

  /** Get the account's device groups */
  fetchAzureMapsKey: {
    type: 'APP_AZURE_MAPS_KEY_FETCH',
    epic: fromAction =>
      ConfigService.getAzureMapKey()
        .map(toActionCreator(redux.actions.updateAzureMapsKeyGroup, fromAction))
        .catch(handleError(fromAction))
  },

  /** Listen to route events and emit a route change event when the url changes */
  detectRouteChange: {
    type: 'APP_ROUTE_EVENT',
    rawEpic: (action$, store, actionType) =>
      action$
        .ofType(actionType)
        .map(({ payload }) => payload) // payload === pathname
        .distinctUntilChanged()
        .map(createAction('EPIC_APP_ROUTE_CHANGE'))
  },

  /** Get the logo and company name from the config service */
  fetchLogo: {
    type: 'APP_FETCH_LOGO',
    epic: fromAction =>
      ConfigService.getLogo()
        .map(toActionCreator(redux.actions.updateLogo, fromAction))
        .catch(handleError(fromAction))
  },

  /** Set the logo and/or company name in the config service */
  updateLogo: {
    type: 'APP_UPDATE_LOGO',
    epic: fromAction =>
      ConfigService.setLogo(fromAction.payload.logo, fromAction.payload.headers)
        .map(toActionCreator(redux.actions.updateLogo, fromAction))
        .catch(handleError(fromAction))
  },

  /** Get the current release version and release notes link from GitHub */
  fetchReleaseInformation: {
    type: 'APP_FETCH_RELEASE_INFO',
    epic: fromAction =>
      GitHubService.getReleaseInfo()
        .map(toActionCreator(redux.actions.getReleaseInformation, fromAction))
        .catch(handleError(fromAction))
  }
});
// ========================= Epics - END

// ========================= Schemas - START
const deviceGroupSchema = new schema.Entity('deviceGroups');
const deviceGroupListSchema = new schema.Array(deviceGroupSchema);
// ========================= Schemas - END

// ========================= Reducers - START
const initialState = {
  ...errorPendingInitialState,
  deviceGroups: {},
  deviceGroupFilters: {},
  activeDeviceGroupId: undefined,
  theme: 'dark',
  version: undefined,
  releaseNotesUrl: undefined,
  logo: svgs.contoso,
  name: 'companyName',
  isDefaultLogo: true,
  azureMapsKey: '',
  deviceGroupFlyoutIsOpen: false,
  timeInterval: 'PT1H',

  //TODO: Get this from the server. This is just hardcoded test data for now.
  userPermissions: new Set([
    permissions.createDeviceGroups,
    permissions.deleteDeviceGroups,
    permissions.updateDeviceGroups,

    permissions.createDevices,
    permissions.deleteDevices,
    permissions.updateDevices,

    permissions.createRules,
    permissions.deleteRules,
    permissions.updateRules,

    permissions.deleteAlarms,
    permissions.updateAlarms,

    permissions.createJobs,

    permissions.updateSIMManagement
  ])
};

const updateDeviceGroupsReducer = (state, { payload, fromAction }) => {
  const { entities: { deviceGroups } } = normalize(payload, deviceGroupListSchema);
  return update(state, {
    deviceGroups: { $set: deviceGroups },
    ...setPending(fromAction.type, false)
  });
};

const deleteDeviceGroupsReducer = (state, { payload }) => update(state, {
  deviceGroups: { $unset: [...payload] }
});

const insertDeviceGroupsReducer = (state, { payload }) => {
  const { entities: { deviceGroups } } = normalize(payload, deviceGroupListSchema);
  return update(state, {
    deviceGroups: { $merge: deviceGroups }
  });
};

const updateAzureMapsKeyReducer = (state, { payload, fromAction }) => update(state, {
  azureMapsKey: { $set: payload },
  ...setPending(fromAction.type, false)
});

const updateActiveDeviceGroupsReducer = (state, { payload }) => update(state,
  { activeDeviceGroupId: { $set: payload } }
);

const updateThemeReducer = (state, { payload }) => update(state,
  { theme: { $set: payload } }
);

const updateTimeInterval = (state, { payload }) => update(state,
  { timeInterval: { $set: payload } }
);

const logoReducer = (state, { payload, fromAction }) => update(state, {
  logo: { $set: payload.logo ? payload.logo : svgs.contoso },
  name: { $set: payload.name ? payload.name : 'companyName' },
  isDefaultLogo: { $set: payload.logo ? false : true },
  ...setPending(fromAction.type, false)
});

const releaseReducer = (state, { payload }) => update(state, {
  version: { $set: payload.version },
  releaseNotesUrl: { $set: payload.releaseNotesUrl }
});

const setDeviceGroupFlyoutReducer = (state, { payload }) => update(state, {
  deviceGroupFlyoutIsOpen: { $set: !!payload }
});

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchDeviceGroups,
  epics.actionTypes.fetchDeviceGroupFilters,
  epics.actionTypes.fetchAzureMapsKey,
  epics.actionTypes.updateLogo,
  epics.actionTypes.fetchLogo
];

export const redux = createReducerScenario({
  updateDeviceGroups: { type: 'APP_DEVICE_GROUP_UPDATE', reducer: updateDeviceGroupsReducer },
  deleteDeviceGroups: { type: 'APP_DEVICE_GROUP_DELETE', reducer: deleteDeviceGroupsReducer },
  insertDeviceGroups: { type: 'APP_DEVICE_GROUP_INSERT', reducer: insertDeviceGroupsReducer },
  updateAzureMapsKeyGroup: { type: 'APP_AZURE_MAPS_KEY_UPDATE', reducer: updateAzureMapsKeyReducer },
  updateActiveDeviceGroup: { type: 'APP_ACTIVE_DEVICE_GROUP_UPDATE', reducer: updateActiveDeviceGroupsReducer },
  changeTheme: { type: 'APP_CHANGE_THEME', reducer: updateThemeReducer },
  registerError: { type: 'APP_REDUCER_ERROR', reducer: errorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer },
  updateLogo: { type: 'APP_UPDATE_LOGO', reducer: logoReducer },
  getReleaseInformation: { type: 'APP_GET_VERSION', reducer: releaseReducer },
  setDeviceGroupFlyoutStatus: { type: 'APP_SET_DEVICE_GROUP_FLYOUT_STATUS', reducer: setDeviceGroupFlyoutReducer },
  updateTimeInterval: { type: 'APP_UPDATE_TIME_INTERVAL', reducer: updateTimeInterval }
});

export const reducer = { app: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getAppReducer = state => state.app;
export const getVersion = state => getAppReducer(state).version;
export const getTheme = state => getAppReducer(state).theme;
export const getDeviceGroupEntities = state => getAppReducer(state).deviceGroups;
export const getActiveDeviceGroupId = state => getAppReducer(state).activeDeviceGroupId;
export const getAzureMapsKey = state => getAppReducer(state).azureMapsKey;
export const getDeviceGroupFlyoutStatus = state => getAppReducer(state).deviceGroupFlyoutIsOpen;
export const getDeviceGroupsError = state =>
  getError(getAppReducer(state), epics.actionTypes.fetchDeviceGroups);
export const getDeviceGroupsPendingStatus = state =>
  getPending(getAppReducer(state), epics.actionTypes.fetchDeviceGroups);
export const getAzureMapsKeyError = state =>
  getError(getAppReducer(state), epics.actionTypes.fetchAzureMapsKey);
export const getAzureMapsKeyPendingStatus = state =>
  getPending(getAppReducer(state), epics.actionTypes.fetchAzureMapsKey);
export const getDeviceGroups = createSelector(
  getDeviceGroupEntities,
  deviceGroups => Object.keys(deviceGroups).map(id => deviceGroups[id])
);
export const getActiveDeviceGroup = createSelector(
  getDeviceGroupEntities, getActiveDeviceGroupId,
  (deviceGroups, activeGroupId) => deviceGroups[activeGroupId]
);
export const getActiveDeviceGroupConditions = createSelector(
  getActiveDeviceGroup,
  activeDeviceGroup => (activeDeviceGroup || {}).conditions
);
export const getLogo = state => getAppReducer(state).logo;
export const getName = state => getAppReducer(state).name;
export const isDefaultLogo = state => getAppReducer(state).isDefaultLogo;
export const getReleaseNotes = state => getAppReducer(state).releaseNotesUrl;
export const setLogoError = state =>
  getError(getAppReducer(state), epics.actionTypes.updateLogo);
export const setLogoPendingStatus = state =>
  getPending(getAppReducer(state), epics.actionTypes.updateLogo);
export const getLogoError = state =>
  getError(getAppReducer(state), epics.actionTypes.fetchLogo);
export const getDeviceGroupError = state =>
  getError(getAppReducer(state), epics.actionTypes.fetchDeviceGroups);
export const getLogoPendingStatus = state =>
  getPending(getAppReducer(state), epics.actionTypes.fetchLogo);

export const getTimeInterval = state => getAppReducer(state).timeInterval;

export const getUserPermissions = state => getAppReducer(state).userPermissions;
// ========================= Selectors - END
