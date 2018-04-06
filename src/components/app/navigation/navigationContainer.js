// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
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

const NavigationContainer = translate()(connect(mapStateToProps)(Navigation));

export default NavigationContainer;
