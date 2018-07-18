// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { getUserPermissions } from 'store/reducers/appReducer';
import { ProtectedImpl } from './protected.impl';

const mapStateToProps = state => ({
  userPermissions: getUserPermissions(state)
});

export const Protected = connect(mapStateToProps, null)(ProtectedImpl);
