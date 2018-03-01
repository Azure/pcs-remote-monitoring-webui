// Copyright (c) Microsoft. All rights reserved.

import { combineEpics } from 'redux-observable';

// Epics
import { epics as appEpics } from './reducers/appReducer';
import { epics as devicesEpics } from './reducers/devicesReducer';

// Extract the epic function from each property object
const epics = [
  ...appEpics.getEpics(),
  ...devicesEpics.getEpics()
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
