// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { RuleEditor } from './ruleEditor';
import { getDeviceGroups } from 'store/reducers/appReducer';
import { redux as rulesRedux } from 'store/reducers/rulesReducer';
import { epics as appEpics } from 'store/reducers/appReducer';

// Pass device groups
const mapStateToProps = state => ({
  deviceGroups: getDeviceGroups(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  insertRules: rules => dispatch(rulesRedux.actions.insertRules(rules)),
  modifyRules: rules => dispatch(rulesRedux.actions.modifyRules(rules)),
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

export const RuleEditorContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(RuleEditor));
