// Copyright (c) Microsoft. All rights reserved.

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { AuthService } from 'services';
import { getUser } from 'store/reducers/appReducer';
import { Profile } from './profile';

const mapStateToProps = state => ({
  user: getUser(state)
});

const mapDispatchToProps = () => ({
  logout: () => AuthService.logout()
});

export const ProfileContainer = withRouter(translate()(connect(mapStateToProps, mapDispatchToProps)(Profile)));
