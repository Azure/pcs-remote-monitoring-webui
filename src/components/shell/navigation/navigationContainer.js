// Copyright (c) Microsoft. All rights reserved.

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getLogo,
  getName,
  isDefaultLogo,
  getLogoPendingStatus,
  epics as appEpics
} from 'store/reducers/appReducer';
import Navigation from './navigation';

const mapStateToProps = state => ({
  logo: getLogo(state),
  name: getName(state),
  isDefaultLogo: isDefaultLogo(state),
  getLogoPending: getLogoPendingStatus(state)
});

const mapDispatchToProps = dispatch => ({
  logEvent: diagnosticsModel => dispatch(appEpics.actions.logEvent(diagnosticsModel))
});

const NavigationContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));

export default NavigationContainer;
