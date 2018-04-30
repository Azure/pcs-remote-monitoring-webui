// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { RuleStatus } from './ruleStatus';
import { redux as rulesRedux } from 'store/reducers/rulesReducer';

// Wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  updateRule: rule => dispatch(rulesRedux.actions.updateRule(rule))
});

export const RuleStatusContainer = translate()(connect(null, mapDispatchToProps)(RuleStatus));
