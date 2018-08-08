// Copyright (c) Microsoft. All rights reserved.

import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootEpic from './rootEpic';
import rootReducer from './rootReducer';

export default function configureStore() {
  // Initialize the redux-observable epics
  const epicMiddleware = createEpicMiddleware(rootEpic);
  // Initialize the redux store with middleware
  return createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(epicMiddleware)
    )
  );
}
