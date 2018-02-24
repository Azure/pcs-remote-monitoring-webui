// Copyright (c) Microsoft. All rights reserved.

import { combineReducers } from 'redux';

// Reducers
import { reducer as appReducer } from './reducers/appReducer';

const rootReducer = combineReducers({
  ...appReducer
});

export default rootReducer;
