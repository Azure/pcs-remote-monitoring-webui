// Copyright (c) Microsoft. All rights reserved.

import { Observable } from 'rxjs';
import update from 'immutability-helper';

// A collection of helper objects for reducing store/redux-observable boilerplate

/**
 * Utility method for generating redux action creators
 */
export const createAction = (type, staticPayload) => {
  const creator = (payload, meta = {}) => ({ type, payload, ...meta });
  const useStaticPayload = typeof staticPayload !== 'undefined';
  return useStaticPayload ? () => creator(staticPayload) : creator;
};

/**
 * Capture any uncaught errors to avoid causing the epic stream to fail
 */
function handleUncaughtError(type) {
  return error => {
    console.error(`Uncaught error in epic "${type}":`, error);
    return Observable.empty();
  }
}

/**
 * A helper method for choosing between the epic and rawEpic parameters of the
 * createEpicCase input
 */
function chooseEpicParam(type, epic, rawEpic) {
  if (rawEpic) {
    return (action$, store) =>
      rawEpic(action$, store, type).catch(handleUncaughtError(type));
  }
  return (action$, store) =>
    action$.ofType(type)
      .flatMap(action => epic(action, store, action$))
      .catch(handleUncaughtError(type));
}

/**
 * A helper function creating epic scenarios
 * An epic scenario consists of three properties
 *  - The action type string
 *  - The action creator
 *  - The epic that handles actions of given type
 */
export function createEpicCase(params) {
  if ((!params.type && !params.rawType) || (!params.epic && !params.rawEpic)) {
    throw new Error('Error in createEpicCase: "type" and "epic" are required parameters');
  }

  // The scenario properties
  const type = params.rawType || `EPIC_${params.type}`;
  const action = createAction(type, params.staticPayload);
  const epic = chooseEpicParam(type, params.epic, params.rawEpic);

  return { type, action, epic };
}

/**
 * A helper function creating epics from epic cases.
 * An epic scenario takes an object of epic cases and returns
 * the following object:
 *  - actionTypes: An object of user defined names mapped to action type strings
 *  - actions: An object of user defined names mapped to action creators
 *  - epics: An object of user defined names mapped to epic
 */
export function createEpicScenario(cases = {}) {
  const scenario = Object.keys(cases)
    .reduce(
      (acc, caseName) => {
        const { type, action, epic } = createEpicCase(cases[caseName]);
        return {
          actionTypes: { ...acc.actionTypes, [caseName]: type },
          actions: { ...acc.actions, [caseName]: action },
          epics: { ...acc.epics, [caseName]: epic }
        };
      },
      {
        actionTypes: {},
        actions: {},
        epics: {}
      }
    );

  const getEpics = () => Object.keys(scenario.epics).map(key => scenario.epics[key]);

  return { ...scenario, getEpics }
}

/**
 * A helper function for creating reducer case property objects
 * A reducer case consists of three properties
 *  - The action type string
 *  - The action creator
 *  - The reducer that handles actions of given type
 */
function createReducerCase(params) {
  if ((!params.type && !params.rawType && !params.multiType) || !params.reducer) {
    throw new Error('Error in createReducerCase: "type" and "reducer" are required parameters');
  }

  // The scenario properties
  const type = params.multiType || params.rawType || `REDUX_${params.type}`;
  const action = !params.multiType ? createAction(type, params.staticPayload) : undefined;
  const reducer = params.reducer

  return { type, action, reducer };
}

/**
 * A helper function creating reducers from reducer cases.
 * A reducer scenario takes an object of reducer cases and returns
 * the following object:
 *  - actionTypes: An object of user defined names mapped to action type strings
 *  - actions: An object of user defined names mapped to action creators
 *  - reducers: An object of user defined names mapped to reducer functions
 */
export function createReducerScenario(cases = {}) {
  // A mapping from scenario names to their reducer properties
  const { actionTypes, actions, reducers } = Object.keys(cases)
    .reduce(
      (acc, caseName) => {
        const { type, action, reducer } = createReducerCase(cases[caseName]);
        return {
          actionTypes: { ...acc.actionTypes, [caseName]: type },
          actions: { ...acc.actions, [caseName]: action },
          reducers: { ...acc.reducers, [caseName]: reducer }
        };
      },
      {
        actionTypes: {},
        actions: {},
        reducers: {}
      }
    );

  // A mapping from action type strings to their reducers
  // Used for fast lookup of action types in the primary reducer method
  const actionReducers = Object.keys(reducers)
    .reduce((acc, actionName) => {
      const actionType = actionTypes[actionName];
      const matchTypes = Array.isArray(actionType) ? actionType : [ actionType ];
      const reducer = reducers[actionName];
      const reducerMapping = matchTypes.reduce((acc, type) => ({ ...acc, [type]: reducer }), {});
      return { ...acc, ...reducerMapping };
    }, {});

  // The full reducer for the scenario
  const getReducer = (initialState = {}) => (state = initialState, action) => {
    if (action.type in actionReducers) {
      return actionReducers[action.type](state, action);
    }
    return state;
  };

  return { actionTypes, actions, reducers, getReducer };
}

/*
 * Many reducers need to track loading states and error states.
 * These methods make managing these states easily replicable
 * across reducers.
 */
export const errorPendingInitialState = { pending: {}, errors: {} };

// setPending and setError are intended to be used inside immutability-helper update
export const setPending = (type, flag) => ({
  pending: { [type]: { $set: flag }}
});

export const setError = (type, error) => ({
  errors: { [type]: { $set: error }}
});

export const pendingReducer = (state, { type }) => update(state, {
  ...setPending(type, true),
  ...setError(type)
});

export const errorReducer = (state, { payload, error }) => update(state, {
  ...setPending(payload, false),
  ...setError(payload, error)
});

export const getPending = (state, type) => state.pending[type];
export const getError = (state, type) => state.errors[type];

export const toActionCreator = (actionCreator, fromAction) => payload => actionCreator(payload, { fromAction });
