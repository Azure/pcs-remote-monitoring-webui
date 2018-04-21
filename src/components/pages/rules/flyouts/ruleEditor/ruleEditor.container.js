// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { RuleEditor } from './ruleEditor';
import { getDeviceGroups } from 'store/reducers/appReducer';
import { redux as rulesRedux } from 'store/reducers/rulesReducer';

// Pass the devices status
const mapStateToProps = state => ({
  deviceGroups: getDeviceGroups(state)
});

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  insertRule: rule => dispatch(rulesRedux.actions.insertRule(rule)),
  updateRule: rule => dispatch(rulesRedux.actions.updateRule(rule))
});

export const RuleEditorContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(RuleEditor));
