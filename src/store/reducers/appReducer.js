// Copyright (c) Microsoft. All rights reserved.

import 'rxjs';
import { Observable } from 'rxjs';
import { AuthService, ConfigService, GitHubService, DiagnosticsService } from 'services';
import moment from 'moment';
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
import { svgs, compareByProperty } from 'utilities';
import { toDiagnosticsModel } from 'services/models';

// ========================= Epics - START
const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

export const epics = createEpicScenario({
  /** Initializes the redux state */
  initializeApp: {
    type: 'APP_INITIALIZE',
    epic: () => [
      epics.actions.fetchUser(),
      epics.actions.fetchDeviceGroups(),
      epics.actions.fetchLogo(),
      epics.actions.fetchReleaseInformation(),
      epics.actions.fetchSolutionSettings()
    ]
  },

  /** Log diagnostics data */
  logEvent: {
    type: 'APP_LOG_EVENT',
    epic: ({ payload }, store) => {
      const diagnosticsOptIn = getDiagnosticsOptIn(store.getState());
      if (diagnosticsOptIn) {
        payload.sessionId = getSessionId(store.getState());
        payload.eventProperties.CurrentWindow = getCurrentWindow(store.getState());
        return DiagnosticsService.logEvent(payload)
        /* We don't want anymore action to be executed after this call
            and hence return empty observable in flatMap */
          .flatMap(_ => Observable.empty())
          .catch(_ => Observable.empty())
      } else {
        return Observable.empty()
      }
    }
  },

  /** Get the user */
  fetchUser: {
    type: 'APP_USER_FETCH',
    epic: (fromAction, store) =>
      AuthService.getCurrentUser()
        .map(toActionCreator(redux.actions.updateUser, fromAction))
        .catch(handleError(fromAction))
  },

  /** Get solution settings */
  fetchSolutionSettings: {
    type: 'APP_FETCH_SOLUTION_SETTINGS',
    epic: (fromAction) =>
      ConfigService.getSolutionSettings()
        .map(toActionCreator(redux.actions.updateSolutionSettings, fromAction))
        .catch(handleError(fromAction))
  },

  /** Update solution settings */
  updateDiagnosticsOptIn: {
    type: 'APP_UPDATE_DIAGNOSTICS_OPTOUT',
    epic: (fromAction, store) => {
      const currSettings = getSettings(store.getState());
      const settings = {
        name: currSettings.name,
        description: currSettings.description,
        diagnosticsOptIn: fromAction.payload
      };

      var logEventName = 'Diagnostics_OptIn';
      if (!fromAction.payload) {
        logEventName = 'Diagnostics_OptOut';
      }
      var logPayload = toDiagnosticsModel(logEventName, {});
      logPayload.sessionId = getSessionId(store.getState());
      logPayload.eventProperties.CurrentWindow = getCurrentWindow(store.getState());
      DiagnosticsService.logEvent(logPayload).subscribe();

      return ConfigService.updateSolutionSettings(settings)
        .map(toActionCreator(redux.actions.updateSolutionSettings, fromAction))
        .catch(handleError(fromAction));
    }
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
  deviceGroupFlyoutIsOpen: false,
  timeInterval: 'PT1H',
  settings: {
    azureMapsKey: '',
    description: '',
    name: '',
    diagnosticsOptIn: true
  },
  userPermissions: new Set(),
  sessionId: moment().utc().unix(),
  currentWindow: ''
};

const updateUserReducer = (state, { payload, fromAction }) => {
  return update(state, {
    userPermissions: { $set: new Set(payload.permissions) },
    ...setPending(fromAction.type, false)
  });
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

const updateSolutionSettingsReducer = (state, { payload, fromAction }) => update(state, {
  settings: { $merge: payload },
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

const updateCurrentWindow = (state, { payload }) => update(state,
  { currentWindow: { $set: payload } }
);

/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchDeviceGroups,
  epics.actionTypes.fetchDeviceGroupFilters,
  epics.actionTypes.updateLogo,
  epics.actionTypes.fetchLogo,
  epics.actions.fetchSolutionSettings
];

export const redux = createReducerScenario({
  updateUser: { type: 'APP_USER_UPDATE', reducer: updateUserReducer },
  updateDeviceGroups: { type: 'APP_DEVICE_GROUP_UPDATE', reducer: updateDeviceGroupsReducer },
  deleteDeviceGroups: { type: 'APP_DEVICE_GROUP_DELETE', reducer: deleteDeviceGroupsReducer },
  insertDeviceGroups: { type: 'APP_DEVICE_GROUP_INSERT', reducer: insertDeviceGroupsReducer },
  updateActiveDeviceGroup: { type: 'APP_ACTIVE_DEVICE_GROUP_UPDATE', reducer: updateActiveDeviceGroupsReducer },
  changeTheme: { type: 'APP_CHANGE_THEME', reducer: updateThemeReducer },
  registerError: { type: 'APP_REDUCER_ERROR', reducer: errorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer },
  updateLogo: { type: 'APP_UPDATE_LOGO', reducer: logoReducer },
  updateSolutionSettings: { type: 'APP_UPDATE_SOLUTION_SETTINGS', reducer: updateSolutionSettingsReducer },
  getReleaseInformation: { type: 'APP_GET_VERSION', reducer: releaseReducer },
  setDeviceGroupFlyoutStatus: { type: 'APP_SET_DEVICE_GROUP_FLYOUT_STATUS', reducer: setDeviceGroupFlyoutReducer },
  updateTimeInterval: { type: 'APP_UPDATE_TIME_INTERVAL', reducer: updateTimeInterval },
  updateCurrentWindow: { type: 'APP_UPDATE_CURRENT_WINDOW', reducer: updateCurrentWindow }
});

export const reducer = { app: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getAppReducer = state => state.app;
export const getVersion = state => getAppReducer(state).version;
export const getTheme = state => getAppReducer(state).theme;
export const getDeviceGroupEntities = state => getAppReducer(state).deviceGroups;
export const getActiveDeviceGroupId = state => getAppReducer(state).activeDeviceGroupId;
export const getSettings = state => getAppReducer(state).settings;
export const getAzureMapsKey = state => getSettings(state).azureMapsKey;
export const getDiagnosticsOptIn = state => getSettings(state).diagnosticsOptIn;
export const getDeviceGroupFlyoutStatus = state => getAppReducer(state).deviceGroupFlyoutIsOpen;
export const getDeviceGroupsError = state =>
  getError(getAppReducer(state), epics.actionTypes.fetchDeviceGroups);
export const getDeviceGroupsPendingStatus = state =>
  getPending(getAppReducer(state), epics.actionTypes.fetchDeviceGroups);
export const getSolutionSettingsError = state =>
  getError(getAppReducer(state), epics.actionTypes.fetchSolutionSettings);
export const getSolutionSettingsPendingStatus = state =>
  getPending(getAppReducer(state), epics.actionTypes.fetchSolutionSettings);
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
export const getSessionId = state => getAppReducer(state).sessionId;
export const getCurrentWindow = state => getAppReducer(state).currentWindow
// ========================= Selectors - END
