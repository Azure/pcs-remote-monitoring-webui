// Copyright (c) Microsoft. All rights reserved.

import { combineEpics } from 'redux-observable';

// Epics
import { epics as exampleEpics } from './reducers/_exampleReducer';
import { epics as appEpics } from './reducers/appReducer';
import { epics as devicesEpics } from './reducers/devicesReducer';
import { epics as rulesEpics } from './reducers/rulesReducer';
import { epics as simulationEpics } from './reducers/deviceSimulationReducer';

// Extract the epic function from each property object
const epics = [
  ...exampleEpics.getEpics(),
  ...appEpics.getEpics(),
  ...devicesEpics.getEpics(),
  ...rulesEpics.getEpics(),
  ...simulationEpics.getEpics()
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
