// Copyright (c) Microsoft. All rights reserved.

import { combineEpics } from 'redux-observable';

// Epics
import { epics as appEpics } from 'store/reducers/appReducer';
import { epics as deviceSimulationEpics } from 'store/reducers/deviceSimulationReducer';
import { epics as exampleEpics } from './reducers/exampleReducer';

// Extract the epic function from each property object
const epics = [
  ...appEpics.getEpics(),
  ...deviceSimulationEpics.getEpics(),
  ...exampleEpics.getEpics()
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
