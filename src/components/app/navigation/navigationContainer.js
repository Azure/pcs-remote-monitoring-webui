// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import {
  getLogo,
  getName,
  isDefaultLogo,
} from 'store/reducers/appReducer';
import { Navigation } from './navigation';

const mapStateToProps = state => ({
  logo: getLogo(state),
  name: getName(state),
  isDefaultLogo: isDefaultLogo(state)
});

const NavigationContainer = connect(mapStateToProps)(Navigation);

export default NavigationContainer;
