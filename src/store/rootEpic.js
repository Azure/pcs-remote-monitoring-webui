// Copyright (c) Microsoft. All rights reserved.

import { combineEpics } from 'redux-observable';

// Epics
import { epics as appEpics } from './reducers/appReducer';
import { epics as devicesEpics } from './reducers/devicesReducer';
import { epics as rulesEpics } from './reducers/rulesReducer';
import { epics as alarmEpics } from './reducers/alarmsReducer';

// Extract the epic function from each property object
const epics = [
  ...appEpics.getEpics(),
  ...devicesEpics.getEpics(),
  ...rulesEpics.getEpics(),
  ...alarmEpics.getEpics()
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
