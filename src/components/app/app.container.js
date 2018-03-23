// Copyright (c) Microsoft. All rights reserved.

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { AuthService } from 'services';
import {
  epics as appEpics,
  redux as appRedux,
  getTheme
} from 'store/reducers/appReducer';
import App from './app';

const mapStateToProps = state => ({
  theme: getTheme(state)
});

// Wrap with the router and wrap the dispatch method
const mapDispatchToProps = dispatch => ({
  registerRouteEvent: pathname => dispatch(appEpics.actions.detectRouteChange(pathname)),
  changeTheme: theme => dispatch(appRedux.actions.changeTheme(theme)),
  logout: () => AuthService.logout()
});

const AppContainer = withRouter(translate()(connect(mapStateToProps, mapDispatchToProps)(App)));

export default AppContainer;
