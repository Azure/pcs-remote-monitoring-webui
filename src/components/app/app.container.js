// Copyright (c) Microsoft. All rights reserved.

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { AuthService } from 'services';
import { epics as appEpics } from 'store/reducers/appReducer';
import App from './app';

// Wrap with the router and wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  registerRouteEvent: pathname => dispatch(appEpics.actions.detectRouteChange(pathname)),
  logout: () => AuthService.logout()
});

const AppContainer = withRouter(translate()(connect(undefined, mapDispatchToProps)(App)));

export default AppContainer;
