// Copyright (c) Microsoft. All rights reserved.

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getLogo,
  getName,
  isDefaultLogo,
} from 'store/reducers/appReducer';
import Navigation from './navigation';

const mapStateToProps = state => ({
  logo: getLogo(state),
  name: getName(state),
  isDefaultLogo: isDefaultLogo(state)
});

const NavigationContainer = withRouter(connect(mapStateToProps)(Navigation));

export default NavigationContainer;
