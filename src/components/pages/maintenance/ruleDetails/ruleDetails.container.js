// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { RuleDetails } from './ruleDetails';
import { epics as appEpics } from 'store/reducers/appReducer';

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

export const RuleDetailsContainer = connect(null, mapDispatchToProps)(RuleDetails);
