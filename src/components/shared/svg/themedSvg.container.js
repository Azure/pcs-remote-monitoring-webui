// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { ThemedSvg } from './themedSvg';
import { getTheme } from 'store/reducers/appReducer';

const mapStateToProps = state => ({
  theme: getTheme(state)
});

export const ThemedSvgContainer = connect(mapStateToProps, null)(ThemedSvg);
