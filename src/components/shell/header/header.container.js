// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';

import { epics } from 'store/reducers/appReducer';
import { Header } from './header';

const mapDispatchToProps = dispatch => ({
  logEvent: diagnosticsModel => dispatch(epics.actions.logEvent(diagnosticsModel))
});

export const HeaderContainer = connect(null, mapDispatchToProps)(Header);
