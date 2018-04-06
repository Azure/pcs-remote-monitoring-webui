// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import { ConfigService, GitHubService } from 'services';
import { schema, normalize } from 'normalizr';
import { createSelector } from 'reselect';
import update from 'immutability-helper';
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
import { svgs } from 'utilities';

// ========================= Epics - START
const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

export const epics = createEpicScenario({
  /** Initializes the redux state */
  initializeApp: {
    type: 'APP_INITIALIZE',
    epic: () => [
      epics.actions.fetchDeviceGroups(),
      redux.actions.updateActiveDeviceGroup(),
      epics.actions.fetchLogo(),
      epics.actions.fetchReleaseInformation()
    ]
  },

  /** Get the account's device groups */
  fetchDeviceGroups: {
    type: 'APP_DEVICE_GROUPS_FETCH',
    epic: fromAction =>
      ConfigService.getDeviceGroups()
        .map(toActionCreator(redux.actions.updateDeviceGroups, fromAction))
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
  activeDeviceGroupId: undefined,
  theme: 'dark',
  version: undefined,
  releaseNotesUrl: undefined,
  logo: undefined,
  name: undefined,
  isDefaultLogo: true,
  azureMapsKey: ''
};

const updateDeviceGroupsReducer = (state, { payload, fromAction }) => {
  const { entities: { deviceGroups } } = normalize(payload, deviceGroupListSchema);
  return update(state, {
    deviceGroups: { $set: deviceGroups },
    ...setPending(fromAction.type, false)
  });
};

const updateActiveDeviceGroupsReducer = (state, { payload }) => update(state,
  { activeDeviceGroupId: { $set: payload } }
);

const updateThemeReducer = (state, { payload }) => update(state,
  { theme: { $set: payload } }
);

const logoReducer = (state, { payload }) => update(state, {
    logo: { $set: payload.logo ? payload.logo : svgs.contoso },
    name: { $set: payload.name ? payload.name : 'Contoso' },
    isDefaultLogo: { $set: payload.logo ? false : true }
  });

const releaseReducer = (state, { payload }) => update(state, {
    version: { $set: payload.version },
    releaseNotesUrl: { $set: payload.releaseNotesUrl }
  });

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchDeviceGroups
];

export const redux = createReducerScenario({
  updateDeviceGroups: { type: 'APP_DEVICE_GROUP_UPDATE', reducer: updateDeviceGroupsReducer },
  updateActiveDeviceGroup: { type: 'APP_ACTIVE_DEVICE_GROUP_UPDATE', reducer: updateActiveDeviceGroupsReducer },
  changeTheme: { type: 'APP_CHANGE_THEME', reducer: updateThemeReducer },
  registerError: { type: 'APP_REDUCER_ERROR', reducer: errorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer },
  updateLogo: { type: 'APP_UPDATE_LOGO', reducer: logoReducer },
  getReleaseInformation: { type: 'APP_GET_VERSION', reducer: releaseReducer }
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
export const getDeviceGroupsError = state =>
  getError(getAppReducer(state), epics.actionTypes.fetchDeviceGroups);
export const getDeviceGroupsPendingStatus = state =>
  getPending(getAppReducer(state), epics.actionTypes.fetchDeviceGroups);
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
// ========================= Selectors - END
